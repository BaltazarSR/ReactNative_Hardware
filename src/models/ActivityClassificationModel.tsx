import { ActivityType } from '../models/ActivityType';

export interface ActivityClassification {
  activity: ActivityType;
  confidence: number;
}