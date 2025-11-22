import * as Location from 'expo-location';
import { logger } from '../utils/logger';
import { LocationData } from '../models/LocationData';

export class LocationService {
  private subscription: Location.LocationSubscription | null = null;
  private previousLocation: { latitude: number; longitude: number; timestamp: number } | null = null;
  private totalDistance: number = 0;
  private locationUpdateCount: number = 0;
  private readonly WARMUP_READINGS = 5; // Ignore first 5 readings for GPS warmup
  private readonly MAX_REASONABLE_SPEED = 50; // 50 m/s = 180 km/h (maximum reasonable speed)
  private readonly MIN_DISTANCE_THRESHOLD = 1; // 1 meter minimum to consider as actual movement (filters GPS drift)

  //Request location permissions from the user
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        logger.log('[LocationService] Location permission denied');
        return false;
      }
      logger.log('[LocationService] Location permission granted');
      return true;
    } catch (error) {
      logger.log(`[LocationService] Error requesting permissions: ${error}`);
      return false;
    }
  }

  //Start watching location updates
  async startTracking(
    onLocationUpdate: (data: LocationData, distance: number, totalDistance: number) => void
  ): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return false;
      }

      this.subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          const { latitude, longitude, speed } = location.coords;
          const currentTimestamp = Date.now();

          this.locationUpdateCount++;

          // Initialize previous location if this is the first update
          if (!this.previousLocation) {
            this.previousLocation = { latitude, longitude, timestamp: currentTimestamp };
            const locationData: LocationData = {
              lat: latitude,
              lon: longitude,
              speed: 0, // Start with 0 speed instead of potentially inaccurate GPS speed
            };
            logger.log('[LocationService] First location update - initializing with 0 speed');
            onLocationUpdate(locationData, 0, this.totalDistance);
            return;
          }

          // Skip warmup readings to allow GPS to stabilize
          if (this.locationUpdateCount <= this.WARMUP_READINGS) {
            logger.log(`[LocationService] Warmup reading ${this.locationUpdateCount}/${this.WARMUP_READINGS} - skipping`);
            // Update previous location WITHOUT calculating distance during warmup
            this.previousLocation = { latitude, longitude, timestamp: currentTimestamp };
            const locationData: LocationData = {
              lat: latitude,
              lon: longitude,
              speed: 0,
            };
            onLocationUpdate(locationData, 0, this.totalDistance);
            return;
          }

          // First reading after warmup - reset previous location timestamp to avoid large time gap
          if (this.locationUpdateCount === this.WARMUP_READINGS + 1) {
            logger.log('[LocationService] First post-warmup reading - resetting for accurate speed calculation');
            this.previousLocation = { latitude, longitude, timestamp: currentTimestamp };
            const locationData: LocationData = {
              lat: latitude,
              lon: longitude,
              speed: 0,
            };
            onLocationUpdate(locationData, 0, this.totalDistance);
            return;
          }

          // Calculate distance from previous location
          const distanceInMeters = this.calculateDistance(
            this.previousLocation.latitude,
            this.previousLocation.longitude,
            latitude,
            longitude
          );

          // Check if distance is below threshold (stationary/GPS drift)
          const isStationary = distanceInMeters < this.MIN_DISTANCE_THRESHOLD;

          // Only update total distance if movement exceeds threshold
          if (!isStationary) {
            this.totalDistance += distanceInMeters;
          }

          // Calculate speed if GPS speed is not available
          const timeElapsedSeconds = (currentTimestamp - this.previousLocation.timestamp) / 1000;
          let finalSpeed: number = 0;

          // If stationary, set speed to 0
          if (isStationary) {
            finalSpeed = 0;
            logger.log('[LocationService] Stationary - distance below threshold, speed set to 0');
          } else if (speed === null || speed === undefined || speed < 0) {
            // Prevent speed calculation from large time gaps
            if (timeElapsedSeconds > 5) {
              logger.log(`[LocationService] Time gap too large (${timeElapsedSeconds.toFixed(1)}s), setting speed to 0`);
              finalSpeed = 0;
            } else {
              finalSpeed = this.calculateSpeed(distanceInMeters, timeElapsedSeconds);
              logger.log(`[LocationService] Using calculated speed: ${finalSpeed.toFixed(2)} m/s`);
            }
          } else {
            // Validate GPS speed is reasonable
            if (speed > this.MAX_REASONABLE_SPEED) {
              logger.log(`[LocationService] GPS speed too high (${speed.toFixed(2)} m/s), using calculated speed instead`);
              finalSpeed = timeElapsedSeconds > 5 ? 0 : this.calculateSpeed(distanceInMeters, timeElapsedSeconds);
            } else {
              finalSpeed = speed;
              logger.log(`[LocationService] Using GPS speed: ${speed.toFixed(2)} m/s`);
            }
          }
          
          // Additional validation: cap the final speed at maximum reasonable value
          if (finalSpeed > this.MAX_REASONABLE_SPEED) {
            logger.log(`[LocationService] Capping speed from ${finalSpeed.toFixed(2)} to ${this.MAX_REASONABLE_SPEED} m/s`);
            finalSpeed = this.MAX_REASONABLE_SPEED;
          }

          const locationData: LocationData = {
            lat: latitude,
            lon: longitude,
            speed: finalSpeed,
          };

          // Update previous location
          this.previousLocation = { latitude, longitude, timestamp: currentTimestamp };

          logger.log(
            `[LocationService] Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}, ` +
            `Speed: ${finalSpeed?.toFixed(2)} m/s, Distance: +${distanceInMeters.toFixed(2)}m`
          );

          onLocationUpdate(locationData, distanceInMeters, this.totalDistance);
        }
      );

      logger.log('[LocationService] Started tracking location');
      return true;
    } catch (error) {
      logger.log(`[LocationService] Error starting tracking: ${error}`);
      return false;
    }
  }

  //Stop watching location updates
  stopTracking(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
      logger.log('[LocationService] Stopped tracking location');
    }
  }

  //Reset tracking state
  reset(): void {
    this.stopTracking();
    this.previousLocation = null;
    this.totalDistance = 0;
    this.locationUpdateCount = 0;
    logger.log('[LocationService] Reset tracking state');
  }

  //Get current total distance
  getTotalDistance(): number {
    return this.totalDistance;
  }

  //Calculate distance between two coordinates using Haversine formula
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  //Calculate speed from distance and time
  private calculateSpeed(distanceInMeters: number, timeInSeconds: number): number {
    if (timeInSeconds === 0) return 0;
    return distanceInMeters / timeInSeconds;
  }
}
