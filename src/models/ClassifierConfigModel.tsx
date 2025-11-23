export interface ClassifierConfigModel {
  // Speed thresholds (m/s)
  idleSpeedThreshold: number;
  walkingSpeedMax: number;
  runningSpeedMax: number;

  // Acceleration thresholds (m/s²)
  idleAccelThreshold: number;
  walkingAccelMin: number;
  walkingAccelMax: number;
  runningAccelMin: number;
  runningAccelMax: number;

  // Confidence levels (%)
  idleConfidence: number;
  walkingConfidence: number;
  runningConfidence: number;
  vehicleConfidence: number;
  edgeCaseIdleConfidence: number;
  edgeCaseWalkingConfidence: number;
  edgeCaseRunningConfidence: number;
  edgeCaseVehicleConfidence: number;
}

export const DEFAULT_CLASSIFIER_CONFIG: ClassifierConfigModel = {
  // Speed thresholds (m/s)
  idleSpeedThreshold: 0.5,
  walkingSpeedMax: 2.5, // ~1-9 km/h
  runningSpeedMax: 7.0, // ~9-25 km/h

  // Acceleration thresholds (m/s²)
  idleAccelThreshold: 0.3,
  walkingAccelMin: 0.3,
  walkingAccelMax: 2.0,
  runningAccelMin: 1.5,
  runningAccelMax: 4.0,

  // Confidence levels (%)
  idleConfidence: 95,
  walkingConfidence: 85,
  runningConfidence: 80,
  vehicleConfidence: 90,
  edgeCaseIdleConfidence: 60,
  edgeCaseWalkingConfidence: 60,
  edgeCaseRunningConfidence: 60,
  edgeCaseVehicleConfidence: 70,
};
