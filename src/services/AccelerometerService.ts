import { Accelerometer } from 'expo-sensors';
import { logger } from '../utils/logger';
import { AccelerometerData } from '../models/AccelerometerData';

export class AccelerometerService {
  private subscription: { remove: () => void } | null = null;
  private updateInterval: number = 1000; // milliseconds

  // Check if accelerometer is available on the device
  async isAvailable(): Promise<boolean> {
    try {
      const available = await Accelerometer.isAvailableAsync();
      logger.log(`[AccelerometerService] Accelerometer available: ${available}`);
      return available;
    } catch (error) {
      logger.log(`[AccelerometerService] Error checking availability: ${error}`);
      return false;
    }
  }

  // Set the update interval for accelerometer readings
  setUpdateInterval(intervalMs: number): void {
    this.updateInterval = intervalMs;
    Accelerometer.setUpdateInterval(intervalMs);
    logger.log(`[AccelerometerService] Update interval set to ${intervalMs}ms`);
  }

  // Start listening to accelerometer updates
  async startTracking(
    onAccelerometerUpdate: (data: AccelerometerData, netAcceleration: number) => void
  ): Promise<boolean> {
    try {
      const available = await this.isAvailable();
      if (!available) {
        logger.log('[AccelerometerService] Accelerometer not available');
        return false;
      }

      Accelerometer.setUpdateInterval(this.updateInterval);

      this.subscription = Accelerometer.addListener((accelerometerData) => {
        const { x, y, z } = accelerometerData;
        
        // Calculate magnitude of acceleration vector
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        
        // Calculate net acceleration (subtract gravity, multiply by g)
        // Magnitude of ~1 g means device is stationary
        const netAcceleration = Math.abs(magnitude - 1) * 9.81;

        const data: AccelerometerData = {
          x,
          y,
          z,
          magnitude,
        };

        logger.log(
          `[AccelerometerService] x: ${x.toFixed(2)}, y: ${y.toFixed(2)}, z: ${z.toFixed(2)}, ` +
          `magnitude: ${magnitude.toFixed(2)}, net: ${netAcceleration.toFixed(2)} m/s²`
        );

        onAccelerometerUpdate(data, netAcceleration);
      });

      logger.log('[AccelerometerService] Started tracking accelerometer');
      return true;
    } catch (error) {
      logger.log(`[AccelerometerService] Error starting tracking: ${error}`);
      return false;
    }
  }

  // Stop listening to accelerometer updates
  stopTracking(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
      logger.log('[AccelerometerService] Stopped tracking accelerometer');
    }
  }

  // Reset the service
  reset(): void {
    this.stopTracking();
    logger.log('[AccelerometerService] Reset tracking state');
  }
}
