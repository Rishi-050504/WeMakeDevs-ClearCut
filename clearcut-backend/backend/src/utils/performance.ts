import { logger } from './logger.js';

export function trackPerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  
  return fn()
    .then(result => {
      const duration = Date.now() - startTime;
      logger.info(`Performance: ${name}`, { duration: `${duration}ms` });
      return result;
    })
    .catch(error => {
      const duration = Date.now() - startTime;
      logger.error(`Performance (failed): ${name}`, {
        duration: `${duration}ms`,
        error: error.message,
      });
      throw error;
    });
}

export class PerformanceTracker {
  private startTime: number;
  private checkpoints: Map<string, number> = new Map();

  constructor(private name: string) {
    this.startTime = Date.now();
  }

  checkpoint(label: string): void {
    const elapsed = Date.now() - this.startTime;
    this.checkpoints.set(label, elapsed);
    logger.debug(`${this.name} - ${label}: ${elapsed}ms`);
  }

  finish(): void {
    const totalTime = Date.now() - this.startTime;
    logger.info(`${this.name} completed`, {
      totalTime: `${totalTime}ms`,
      checkpoints: Object.fromEntries(this.checkpoints),
    });
  }
}