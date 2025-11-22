import { ActivityType } from '../models/ActivityType';
import { logger } from '../utils/logger';

export interface ActivityClassification {
  activity: ActivityType;
  confidence: number;
}

export class ActivityClassifierService {
  // Thresholds for activity classification
  private readonly IDLE_SPEED_THRESHOLD = 0.5; // m/s
  private readonly WALKING_SPEED_MAX = 2.5; // m/s (~1-9 km/h)
  private readonly RUNNING_SPEED_MAX = 7.0; // m/s (~9-25 km/h)

  private readonly IDLE_ACCEL_THRESHOLD = 0.3; // m/s²
  private readonly WALKING_ACCEL_MIN = 0.3; // m/s²
  private readonly WALKING_ACCEL_MAX = 2.0; // m/s²
  private readonly RUNNING_ACCEL_MIN = 1.5; // m/s²
  private readonly RUNNING_ACCEL_MAX = 4.0; // m/s²

  // Classify activity based on speed and acceleration
  classifyActivity(speedMps: number, accelerationMps2: number): ActivityClassification {
    let activity: ActivityType = ActivityType.UNKNOWN;
    let confidence: number = 0;

    // IDLE: Very low speed and acceleration
    if (speedMps < this.IDLE_SPEED_THRESHOLD && accelerationMps2 < this.IDLE_ACCEL_THRESHOLD) {
      activity = ActivityType.IDLE;
      confidence = 95;
    }
    // WALKING: Low to moderate speed, moderate acceleration
    else if (
      speedMps >= this.IDLE_SPEED_THRESHOLD &&
      speedMps < this.WALKING_SPEED_MAX &&
      accelerationMps2 >= this.WALKING_ACCEL_MIN &&
      accelerationMps2 <= this.WALKING_ACCEL_MAX
    ) {
      activity = ActivityType.WALKING;
      confidence = 85;
    }
    // RUNNING: Moderate to high speed, higher acceleration
    else if (
      speedMps >= this.WALKING_SPEED_MAX &&
      speedMps < this.RUNNING_SPEED_MAX &&
      accelerationMps2 >= this.RUNNING_ACCEL_MIN &&
      accelerationMps2 <= this.RUNNING_ACCEL_MAX
    ) {
      activity = ActivityType.RUNNING;
      confidence = 80;
    }
    // VEHICLE: High speed, low acceleration (smooth movement)
    else if (speedMps >= this.RUNNING_SPEED_MAX) {
      activity = ActivityType.VEHICLE;
      confidence = 90;
    }
    // Edge cases with lower confidence
    else if (speedMps < this.IDLE_SPEED_THRESHOLD) {
      activity = ActivityType.IDLE;
      confidence = 60;
    } else if (speedMps < this.WALKING_SPEED_MAX) {
      activity = ActivityType.WALKING;
      confidence = 60;
    } else if (speedMps < this.RUNNING_SPEED_MAX) {
      activity = ActivityType.RUNNING;
      confidence = 60;
    } else {
      activity = ActivityType.VEHICLE;
      confidence = 70;
    }

    logger.log(
      `[ActivityClassifierService] Speed: ${speedMps.toFixed(2)} m/s, ` +
      `Accel: ${accelerationMps2.toFixed(2)} m/s² → ${activity} (${confidence}%)`
    );

    return { activity, confidence };
  }

  // Update thresholds (for future calibration features)
  updateThresholds(thresholds: Partial<{
    idleSpeed: number;
    walkingSpeedMax: number;
    runningSpeedMax: number;
    idleAccel: number;
    walkingAccelMin: number;
    walkingAccelMax: number;
    runningAccelMin: number;
    runningAccelMax: number;
  }>): void {
    if (thresholds.idleSpeed !== undefined) {
      (this as any).IDLE_SPEED_THRESHOLD = thresholds.idleSpeed;
    }
    if (thresholds.walkingSpeedMax !== undefined) {
      (this as any).WALKING_SPEED_MAX = thresholds.walkingSpeedMax;
    }
    if (thresholds.runningSpeedMax !== undefined) {
      (this as any).RUNNING_SPEED_MAX = thresholds.runningSpeedMax;
    }
    if (thresholds.idleAccel !== undefined) {
      (this as any).IDLE_ACCEL_THRESHOLD = thresholds.idleAccel;
    }
    if (thresholds.walkingAccelMin !== undefined) {
      (this as any).WALKING_ACCEL_MIN = thresholds.walkingAccelMin;
    }
    if (thresholds.walkingAccelMax !== undefined) {
      (this as any).WALKING_ACCEL_MAX = thresholds.walkingAccelMax;
    }
    if (thresholds.runningAccelMin !== undefined) {
      (this as any).RUNNING_ACCEL_MIN = thresholds.runningAccelMin;
    }
    if (thresholds.runningAccelMax !== undefined) {
      (this as any).RUNNING_ACCEL_MAX = thresholds.runningAccelMax;
    }
    logger.log('[ActivityClassifierService] Thresholds updated');
  }
}
