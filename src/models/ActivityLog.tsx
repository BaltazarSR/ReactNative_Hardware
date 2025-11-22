import { ActivityType } from './ActivityType';

export interface ActivityLog {
  id: string;
  duration: string;
  distance: string;
  steps: string;
  calories: string;
  activityType: ActivityType;
  speed: string;
  acceleration: string;
  confidence: string;
  latitude: string;
  longitude: string;
}
