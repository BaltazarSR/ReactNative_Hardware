import { StorageService } from './StorageService';
import { SessionStatsModel } from '../models/SessionStatsModel';
import { SavedRouteModel } from '../models/SavedRouteModel';
import { logger } from '../utils/logger';

export class RouteService {
  private storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
  }

  // Calculate the center point of a route (for map centering)
  calculateRouteCenter(route: SavedRouteModel[]): { latitude: number; longitude: number } {
    if (route.length === 0) {
      return { latitude: 0, longitude: 0 };
    }

    const sum = route.reduce(
      (acc, point) => ({
        latitude: acc.latitude + point.latitude,
        longitude: acc.longitude + point.longitude,
      }),
      { latitude: 0, longitude: 0 }
    );

    return {
      latitude: sum.latitude / route.length,
      longitude: sum.longitude / route.length,
    };
  }

  // Get bounding box for a route (useful for map region)
  getRouteBounds(route: SavedRouteModel[]): {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  } {
    if (route.length === 0) {
      return { minLat: 0, maxLat: 0, minLng: 0, maxLng: 0 };
    }

    const lats = route.map(p => p.latitude);
    const lngs = route.map(p => p.longitude);

    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  }

  // Calculate delta values for map region
  calculateMapRegion(route: SavedRouteModel[]): {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } {
    if (route.length === 0) {
      return {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    const center = this.calculateRouteCenter(route);
    const bounds = this.getRouteBounds(route);

    const latDelta = (bounds.maxLat - bounds.minLat) * 1.5; // Add 50% padding
    const lngDelta = (bounds.maxLng - bounds.minLng) * 1.5;

    return {
      latitude: center.latitude,
      longitude: center.longitude,
      latitudeDelta: Math.max(latDelta, 0.01), // Minimum delta to ensure visibility
      longitudeDelta: Math.max(lngDelta, 0.01),
    };
  }

  // Format distance for display (km)
  formatDistance(distance: number): string {
    return `${distance.toFixed(2)} m`;
  }

  // Format duration for display
  formatDuration(duration: string): string {
    return `${duration} s`;
  }

  // Format calories for display
  formatCalories(calories: number): string {
    return `${Math.round(calories)} cal`;
  }

  // Format steps for display
  formatPoints(steps: number): string {
    return `${Math.round(steps)} points`;
  }
}
