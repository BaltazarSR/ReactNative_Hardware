import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionStatsModel } from '../models/SessionStatsModel';
import { ActivityLog } from '../models/ActivityLog';
import { SavedRouteModel } from '../models/SavedRouteModel';
import { logger } from '../utils/logger';

const STORAGE_KEY = '@workout_sessions';

export class StorageService {
  
  //Save a workout session to AsyncStorage
  async saveWorkoutSession(
    distance: number,
    duration: string,
    calories: number,
    steps: number,
    logs: ActivityLog[]
  ): Promise<boolean> {
    try {
      // Extract route from logs (latitude, longitude, and create timestamp from log id)
      const route: SavedRouteModel[] = logs.map(log => ({
        latitude: parseFloat(log.latitude),
        longitude: parseFloat(log.longitude),
      }));

      // Create session object
      const session: SessionStatsModel = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString(),
        distance,
        duration,
        calories,
        steps,
        logs,
        route
      };

      // Get existing sessions
      const existingSessions = await this.getAllSessions();
      
      // Add new session
      const updatedSessions = [...existingSessions, session];
      
      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
      
      logger.log(`[StorageService] Session saved successfully: ${session.id}`);
      return true;
    } catch (error) {
      logger.log(`[StorageService] Error saving session: ${error}`);
      return false;
    }
  }

  //Get all saved workout sessions
  async getAllSessions(): Promise<SessionStatsModel[]> {
    try {
      const sessionsJson = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (!sessionsJson) {
        return [];
      }
      
      const sessions: SessionStatsModel[] = JSON.parse(sessionsJson);
      logger.log(`[StorageService] Retrieved ${sessions.length} sessions`);
      return sessions.reverse();
    } catch (error) {
      logger.log(`[StorageService] Error getting sessions: ${error}`);
      return [];
    }
  }

  //Get a specific session by ID
  async getSessionById(id: string): Promise<SessionStatsModel | null> {
    try {
      const sessions = await this.getAllSessions();
      const session = sessions.find(s => s.id === id);
      
      if (session) {
        logger.log(`[StorageService] Session found: ${id}`);
      } else {
        logger.log(`[StorageService] Session not found: ${id}`);
      }
      
      return session || null;
    } catch (error) {
      logger.log(`[StorageService] Error getting session by ID: ${error}`);
      return null;
    }
  }

  //Delete a session by ID
  async deleteSession(id: string): Promise<boolean> {
    try {
      const sessions = await this.getAllSessions();
      const filteredSessions = sessions.filter(s => s.id !== id);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSessions));
      
      logger.log(`[StorageService] Session deleted: ${id}`);
      return true;
    } catch (error) {
      logger.log(`[StorageService] Error deleting session: ${error}`);
      return false;
    }
  }

  //Clear all saved sessions
  async clearAllSessions(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      logger.log('[StorageService] All sessions cleared');
      return true;
    } catch (error) {
      logger.log(`[StorageService] Error clearing sessions: ${error}`);
      return false;
    }
  }

  //Get total statistics across all sessions
  async getTotalStats(): Promise<{
    totalSessions: number;
    totalDistance: number;
    totalCalories: number;
    totalSteps: number;
  }> {
    try {
      const sessions = await this.getAllSessions();
      
      const totalStats = sessions.reduce(
        (acc, session) => ({
          totalSessions: acc.totalSessions + 1,
          totalDistance: acc.totalDistance + session.distance,
          totalCalories: acc.totalCalories + session.calories,
          totalSteps: acc.totalSteps + session.steps,
        }),
        { totalSessions: 0, totalDistance: 0, totalCalories: 0, totalSteps: 0 }
      );
      
      logger.log(`[StorageService] Total stats calculated: ${totalStats.totalSessions} sessions`);
      return totalStats;
    } catch (error) {
      logger.log(`[StorageService] Error calculating total stats: ${error}`);
      return { totalSessions: 0, totalDistance: 0, totalCalories: 0, totalSteps: 0 };
    }
  }
}
