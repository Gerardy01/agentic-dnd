import { IAccountService } from '@/services/accountService';
import { IAuthService } from '@/services/authService';
import {
  CreateAccountDTO,
  CreateAccountReturn,
  AccountDataReturn,
  UpdateUsernameReturn,
} from '@/interfaces/IAccount';

export interface IAccountOrchestration {
  createAccount(data: CreateAccountDTO): Promise<CreateAccountReturn>;
  getAccount(accountId: string): Promise<AccountDataReturn>;
  updateUsername(accountId: string, username: string): Promise<UpdateUsernameReturn>;
}

export class AccountOrchestration implements IAccountOrchestration {
  constructor(
    private accountService: IAccountService,
    private authService: IAuthService
  ) {}

  async createAccount(data: CreateAccountDTO): Promise<CreateAccountReturn> {
    const account = await this.accountService.createAccount(data);
    await this.authService.generateOtp(account.email);
    const verificationToken = this.authService.generateVerificationToken(account.email);

    return { verificationToken };
  }

  async getAccount(accountId: string): Promise<AccountDataReturn> {
    return await this.accountService.getAccountById(accountId);
  }

  async updateUsername(accountId: string, username: string): Promise<UpdateUsernameReturn> {
    const account = await this.accountService.updateUsername(accountId, username);
    const accessToken = this.authService.generateAccessToken({
      id: account.id,
      email: account.email,
      username: account.username,
    });

    return {
      account,
      accessToken,
    };
  }
}
