export interface ILoggerService {
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, error?: unknown): void;
  success(message: string, ...args: unknown[]): void;
  step(step: string | number, message: string): void;
}

export class LoggerService implements ILoggerService {
  constructor(private context: string) {}

  info(message: string, ...args: unknown[]): void {
    console.log(`[${this.getTimestamp()}] [INFO] [${this.context}] ${message}`, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(`[${this.getTimestamp()}] [WARN] [${this.context}] ${message}`, ...args);
  }

  error(message: string, error?: unknown): void {
    console.error(`[${this.getTimestamp()}] [ERROR] [${this.context}] ${message}`, error ?? '');
  }

  success(message: string, ...args: unknown[]): void {
    console.log(`[${this.getTimestamp()}] [SUCCESS] [${this.context}] ✓ ${message}`, ...args);
  }

  step(step: string | number, message: string): void {
    console.log(`\n[${this.getTimestamp()}] [STEP ${step}] [${this.context}] ${message}`);
  }

  private getTimestamp(): string {
    return new Date().toLocaleTimeString('en-US', { hour12: false });
  }
}
