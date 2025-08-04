import { cleanupExpiredOffers } from './grandExchangeUtils';

export class TaskScheduler {
  private intervals: NodeJS.Timeout[] = [];

  public start() {
    const cleanupInterval = setInterval(async () => {
      try {
        await cleanupExpiredOffers();
      } catch (error) {
        console.error('Error during scheduled cleanup:', error);
      }
    }, 60 * 60 * 1000); // Run every hour

    this.intervals.push(cleanupInterval);
    console.log('Task scheduler started - Grand Exchange cleanup will run every hour');
  }

  public stop() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    console.log('Task scheduler stopped');
  }
}

export const taskScheduler = new TaskScheduler();