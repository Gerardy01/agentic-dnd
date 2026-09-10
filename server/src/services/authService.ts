import crypto from 'crypto';
import { Op } from 'sequelize';
import { OtpAuth, RefreshToken } from '@/models';
import { IJwtProvider } from '@/provider/jwtProvider';
import { IEventPublisherProvider } from '@/provider/eventPublisherProvider';
import { VerificationTokenBody } from '@/interfaces/IAuth';
import { EventTypeEnum } from '@/utils/enums';
import { NotValid, WrongFormat } from '@/utils/exceptions';

export interface IAuthService {
  generateOtp(email: string): Promise<number>;
  verifyOtp(email: string, code: number): Promise<boolean>;
  generateVerificationToken(email: string): string;
  verifyVerificationToken(token: string): string;
  createRefreshToken(accountId: string, userAgent?: string): Promise<string>;
  validateRefreshToken(token: string): Promise<string>;
  revokeRefreshToken(identifier: string): Promise<void>;
  generateAccessToken(account: { id: string; email: string; username: string }): string;
}

export class AuthService implements IAuthService {
  constructor(
    private jwtProvider: IJwtProvider,
    private eventPublisher: IEventPublisherProvider
  ) {}

  async generateOtp(email: string): Promise<number> {
    const normalizedEmail = email.toLowerCase().trim();

    // Revoke existing active OTPs for this email to prevent multiple valid codes
    await OtpAuth.update(
      { revoked: true },
      {
        where: {
          send_to: normalizedEmail,
          revoked: false,
        },
      }
    );

    // Loop to ensure randomly generated 6-digit OTP does not collide with active ones in DB
    let code: number = 0;
    while (true) {
      code = Math.floor(100000 + Math.random() * 900000);

      const existingActiveOtp = await OtpAuth.findOne({
        where: {
          code,
          send_to: normalizedEmail,
          revoked: false,
          expires_at: {
            [Op.gt]: new Date(),
          },
        },
      });

      if (!existingActiveOtp) {
        break;
      }
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await OtpAuth.create({
      code,
      send_to: normalizedEmail,
      expires_at: expiresAt,
      revoked: false,
    });

    // Publish in-memory event to trigger email delivery via NotificationService
    this.eventPublisher.publish(EventTypeEnum.OTP_GENERATED, {
      email: normalizedEmail,
      code,
    });

    return code;
  }

  async verifyOtp(email: string, code: number): Promise<boolean> {
    const normalizedEmail = email.toLowerCase().trim();

    const otpRecord = await OtpAuth.findOne({
      where: {
        send_to: normalizedEmail,
        code,
        revoked: false,
        expires_at: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!otpRecord) {
      throw new WrongFormat('Invalid or expired OTP code');
    }

    otpRecord.revoked = true;
    await otpRecord.save();

    return true;
  }

  generateVerificationToken(email: string): string {
    const payload: VerificationTokenBody = {
      email: email.toLowerCase().trim(),
      type: 'verification',
    };
    return this.jwtProvider.sign(payload, '15m');
  }

  verifyVerificationToken(token: string): string {
    try {
      const decoded = this.jwtProvider.verify<VerificationTokenBody>(token);
      if (decoded.type !== 'verification' || !decoded.email) {
        throw new NotValid('Invalid verification token');
      }
      return decoded.email;
    } catch (error) {
      throw new NotValid('Verification token is invalid or expired');
    }
  }

  async createRefreshToken(accountId: string, userAgent?: string): Promise<string> {
    const identifier = crypto.randomUUID();
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await RefreshToken.create({
      account_id: accountId,
      token_expiry_date: expiryDate,
      user_agent: userAgent || null,
      is_revoked: false,
      identifier,
    });

    return identifier;
  }

  async validateRefreshToken(identifier: string): Promise<string> {
    const tokenRecord = await RefreshToken.findOne({
      where: {
        identifier,
        is_revoked: false,
        token_expiry_date: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!tokenRecord) {
      throw new NotValid('Invalid or expired refresh token');
    }

    return tokenRecord.account_id;
  }

  async revokeRefreshToken(identifier: string): Promise<void> {
    const tokenRecord = await RefreshToken.findOne({
      where: {
        identifier,
        is_revoked: false,
        token_expiry_date: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!tokenRecord) {
      throw new NotValid('Invalid or expired refresh token');
    }

    tokenRecord.is_revoked = true;
    await tokenRecord.save();
  }

  generateAccessToken(account: { id: string; email: string; username: string }): string {
    return this.jwtProvider.sign(
      {
        accountId: account.id,
        email: account.email,
        username: account.username,
      },
      '15m'
    );
  }
}
