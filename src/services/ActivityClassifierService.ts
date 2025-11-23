import { ActivityType } from '../models/ActivityType';
import { logger } from '../utils/logger';
import { ActivityClassification } from '../models/ActivityClassificationModel';
import { ClassifierConfigModel, DEFAULT_CLASSIFIER_CONFIG } from '../models/ClassifierConfigModel';

export class ActivityClassifierService {
  private config: ClassifierConfigModel;

  constructor(config?: ClassifierConfigModel) {
    this.config = config || DEFAULT_CLASSIFIER_CONFIG;
  }

  // Classify activity based on speed and acceleration
  classifyActivity(speedMps: number, accelerationMps2: number): ActivityClassification {
    let activity: ActivityType = ActivityType.UNKNOWN;
    let confidence: number = 0;

    // IDLE: Very low speed and acceleration
    if (speedMps < this.config.idleSpeedThreshold && accelerationMps2 < this.config.idleAccelThreshold) {
      activity = ActivityType.IDLE;
      confidence = this.config.idleConfidence;
    }
    // WALKING: Low to moderate speed, moderate acceleration
    else if (
      speedMps >= this.config.idleSpeedThreshold &&
      speedMps < this.config.walkingSpeedMax &&
      accelerationMps2 >= this.config.walkingAccelMin &&
      accelerationMps2 <= this.config.walkingAccelMax
    ) {
      activity = ActivityType.WALKING;
      confidence = this.config.walkingConfidence;
    }
    // RUNNING: Moderate to high speed, higher acceleration
    else if (
      speedMps >= this.config.walkingSpeedMax &&
      speedMps < this.config.runningSpeedMax &&
      accelerationMps2 >= this.config.runningAccelMin &&
      accelerationMps2 <= this.config.runningAccelMax
    ) {
      activity = ActivityType.RUNNING;
      confidence = this.config.runningConfidence;
    }
    // VEHICLE: High speed, low acceleration (smooth movement)
    else if (speedMps >= this.config.runningSpeedMax) {
      activity = ActivityType.VEHICLE;
      confidence = this.config.vehicleConfidence;
    }
    // Edge cases with lower confidence
    else if (speedMps < this.config.idleSpeedThreshold) {
      activity = ActivityType.IDLE;
      confidence = this.config.edgeCaseIdleConfidence;
    } else if (speedMps < this.config.walkingSpeedMax) {
      activity = ActivityType.WALKING;
      confidence = this.config.edgeCaseWalkingConfidence;
    } else if (speedMps < this.config.runningSpeedMax) {
      activity = ActivityType.RUNNING;
      confidence = this.config.edgeCaseRunningConfidence;
    } else {
      activity = ActivityType.VEHICLE;
      confidence = this.config.edgeCaseVehicleConfidence;
    }

    logger.log(
      `[ActivityClassifierService] Speed: ${speedMps.toFixed(2)} m/s, ` +
      `Accel: ${accelerationMps2.toFixed(2)} m/s² → ${activity} (${confidence}%)`
    );

    return { activity, confidence };
  }
}
