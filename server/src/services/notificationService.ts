import fs from 'fs';
import path from 'path';
import { IEmailProvider } from '@/provider/emailProvider';
import { IEventPublisherProvider } from '@/provider/eventPublisherProvider';
import { EventTypeEnum } from '@/utils/enums';

export interface INotificationService {
  sendOtpEmail(email: string, code: number): Promise<void>;
}

export class NotificationService implements INotificationService {
  private templateCache: string | null = null;

  constructor(
    private emailProvider: IEmailProvider,
    private eventPublisher: IEventPublisherProvider
  ) {
    this.initEventListeners();
  }

  private initEventListeners(): void {
    this.eventPublisher.subscribe(
      EventTypeEnum.OTP_GENERATED,
      async (data: { email: string; code: number }) => {
        await this.sendOtpEmail(data.email, data.code);
      }
    );
  }

  private getOtpTemplate(): string {
    if (this.templateCache) {
      return this.templateCache;
    }

    const possiblePaths = [
      path.resolve(__dirname, '../templates/otp.html'),
      path.resolve(__dirname, '../../src/templates/otp.html'),
      path.resolve(process.cwd(), 'src/templates/otp.html'),
      path.resolve(process.cwd(), 'dist/templates/otp.html'),
    ];

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        this.templateCache = fs.readFileSync(filePath, 'utf-8');
        return this.templateCache;
      }
    }

    // Fallback minimal template if file not found
    return '<p>Your verification code is: <strong>{{code}}</strong></p>';
  }

  async sendOtpEmail(email: string, code: number): Promise<void> {
    const subject = 'Your Agentic D&D Verification Code';
    const text = `Your verification code is: ${code}. This code will expire in 10 minutes.`;

    const rawTemplate = this.getOtpTemplate();
    const html = rawTemplate.replace(/\{\{code\}\}/g, String(code));

    await this.emailProvider.sendEmail({
      to: email,
      subject,
      text,
      html,
    });
  }
}
