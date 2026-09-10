import { IAccountService } from '@/services/accountService';
import { IAuthService } from '@/services/authService';
import { IHashProvider } from '@/provider/hashProvider';
import {
  LoginDTO,
  VerifyOtpDTO,
  GetOtpDTO,
  VerificationTokenReturn,
  TokenReturn,
} from '@/interfaces/IAuth';
import { WrongFormat } from '@/utils/exceptions';

export interface IAuthOrchestration {
  login(data: LoginDTO): Promise<VerificationTokenReturn>;
  verifyOtp(data: VerifyOtpDTO, userAgent?: string): Promise<{ accessToken: string; refreshToken: string }>;
  resendOtp(data: GetOtpDTO): Promise<void>;
  refreshAccessToken(refreshToken: string): Promise<TokenReturn>;
  logout(refreshToken: string): Promise<void>;
}

export class AuthOrchestration implements IAuthOrchestration {
  constructor(
    private accountService: IAccountService,
    private authService: IAuthService,
    private hashProvider: IHashProvider
  ) {}

  async login(data: LoginDTO): Promise<VerificationTokenReturn> {
    const account = await this.accountService.getAccountByIdentifier(data.identifier);

    const isPasswordValid = await this.hashProvider.compareHash(data.password, account.password);
    if (!isPasswordValid) {
      throw new WrongFormat('Invalid credentials');
    }

    await this.authService.generateOtp(account.email);
    const verificationToken = this.authService.generateVerificationToken(account.email);

    return { verificationToken };
  }

  async verifyOtp(
    data: VerifyOtpDTO,
    userAgent?: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const email = this.authService.verifyVerificationToken(data.verificationToken);
    await this.authService.verifyOtp(email, data.code);

    const account = await this.accountService.getAccountByIdentifier(email);
    const refreshToken = await this.authService.createRefreshToken(account.id, userAgent);
    const accessToken = this.authService.generateAccessToken(account);

    return {
      accessToken,
      refreshToken,
    };
  }

  async resendOtp(data: GetOtpDTO): Promise<void> {
    // Verify that the account exists
    await this.accountService.getAccountByIdentifier(data.email);
    await this.authService.generateOtp(data.email);
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenReturn> {
    const accountId = await this.authService.validateRefreshToken(refreshToken);
    const account = await this.accountService.getAccountById(accountId);
    const accessToken = this.authService.generateAccessToken(account);

    return { accessToken };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.authService.revokeRefreshToken(refreshToken);
  }
}
