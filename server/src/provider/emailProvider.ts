import nodemailer, { Transporter } from 'nodemailer';

export interface SendEmailDTO {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface IEmailProvider {
  sendEmail(data: SendEmailDTO): Promise<void>;
}

export class NodemailerEmailProvider implements IEmailProvider {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  async sendEmail(data: SendEmailDTO): Promise<void> {
    // TODO: to remove after development done - log OTP/email for development testing
    console.log(`\n================== [EMAIL DISPATCH] ==================`);
    console.log(`To: ${data.to}`);
    console.log(`Subject: ${data.subject}`);
    console.log(`Body: ${data.text || data.html}`);
    console.log(`======================================================\n`);

    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await this.transporter.sendMail({
          from: process.env.SMTP_FROM || 'no-reply@agentic-dnd.local',
          to: data.to,
          subject: data.subject,
          text: data.text,
          html: data.html,
        });
      }
    } catch (error) {
      console.warn('Nodemailer failed to send email via SMTP (development mode logged above):', error);
    }
  }
}
