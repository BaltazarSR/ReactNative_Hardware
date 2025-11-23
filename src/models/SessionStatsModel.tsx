import { ActivityLog } from './ActivityLog';
import { SavedRouteModel } from './SavedRouteModel';

export interface SessionStatsModel {
  id: string;
  date: string;
  distance: number;
  duration: string;
  calories: number;
  steps: number;
  logs: ActivityLog[];
  route: SavedRouteModel[];
}
