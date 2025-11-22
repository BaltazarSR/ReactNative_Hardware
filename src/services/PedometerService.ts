import { Pedometer } from 'expo-sensors';
import { logger } from '../utils/logger';

export class PedometerService {
  private subscription: { remove: () => void } | null = null;
  private baselineSteps: number = 0;
  private currentSteps: number = 0;

  // Check if pedometer is available on the device
  async isAvailable(): Promise<boolean> {
    try {
      const available = await Pedometer.isAvailableAsync();
      logger.log(`[PedometerService] Pedometer available: ${available}`);
      return available;
    } catch (error) {
      logger.log(`[PedometerService] Error checking availability: ${error}`);
      return false;
    }
  }

  // Set the baseline step count (steps at the start of tracking)
  async setBaseline(): Promise<void> {
    try {
      const now = new Date();
      const onSecondAgo = new Date(now.getTime() - 1000);
      const result = await Pedometer.getStepCountAsync(onSecondAgo, now);
      this.baselineSteps = result.steps;
      logger.log(`[PedometerService] Baseline steps set to: ${this.baselineSteps}`);
    } catch (error) {
      logger.log(`[PedometerService] Error getting baseline steps: ${error}`);
      this.baselineSteps = 0;
    }
  }

  // Start tracking step count
  async startTracking(
    onStepUpdate: (steps: number, calories: number) => void
  ): Promise<boolean> {
    try {
      const available = await this.isAvailable();
      if (!available) {
        logger.log('[PedometerService] Pedometer not available');
        return false;
      }

      // Set baseline before starting
      await this.setBaseline();

      this.subscription = Pedometer.watchStepCount((result) => {
        // Calculate steps since baseline
        const stepsSinceStart = result.steps - this.baselineSteps;
        this.currentSteps = stepsSinceStart;

        // Estimate calories burned (rough approximation: 0.04 calories per step)
        const estimatedCalories = stepsSinceStart * 0.04;

        logger.log(
          `[PedometerService] Steps: ${stepsSinceStart}, Calories: ${estimatedCalories.toFixed(0)}`
        );

        onStepUpdate(stepsSinceStart, estimatedCalories);
      });

      logger.log('[PedometerService] Started tracking steps');
      return true;
    } catch (error) {
      logger.log(`[PedometerService] Error starting tracking: ${error}`);
      return false;
    }
  }

  // Stop tracking step count
  stopTracking(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
      logger.log('[PedometerService] Stopped tracking steps');
    }
  }

  // Reset the service
  reset(): void {
    this.stopTracking();
    this.baselineSteps = 0;
    this.currentSteps = 0;
    logger.log('[PedometerService] Reset tracking state');
  }

  // Get current step count (since start of tracking)
  getCurrentSteps(): number {
    return this.currentSteps;
  }
}
