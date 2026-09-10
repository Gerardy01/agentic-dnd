import { Account } from '@/models';
import { IHashProvider } from '@/provider/hashProvider';
import { IValidatorProvider } from '@/provider/validatorProvider';
import { CreateAccountDTO, AccountDataReturn, AccountWithPassword } from '@/interfaces/IAccount';
import { ExistData, DataNotFound, WrongFormat } from '@/utils/exceptions';
import { Op } from 'sequelize';

export interface IAccountService {
  createAccount(data: CreateAccountDTO): Promise<AccountDataReturn>;
  getAccountById(id: string): Promise<AccountDataReturn>;
  getAccountByIdentifier(identifier: string): Promise<AccountWithPassword>;
  updateUsername(accountId: string, username: string): Promise<AccountDataReturn>;
}

export class AccountService implements IAccountService {
  constructor(
    private hashProvider: IHashProvider,
    private validatorProvider: IValidatorProvider
  ) {}

  async createAccount(data: CreateAccountDTO): Promise<AccountDataReturn> {
    if (!this.validatorProvider.validateEmail(data.email)) {
      throw new WrongFormat('Invalid email format');
    }

    if (!this.validatorProvider.validatePassword(data.password)) {
      throw new WrongFormat('Password must be at least 8 characters and contain letters and numbers');
    }

    const existingEmail = await Account.findOne({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (existingEmail) {
      throw new ExistData('Email already in use');
    }

    const hashedPassword = await this.hashProvider.hashString(data.password);

    const newAccount = await Account.create({
      email: data.email.toLowerCase().trim(),
      username: '',
      password: hashedPassword,
    });

    return {
      id: newAccount.id,
      username: newAccount.username,
      email: newAccount.email,
      createdAt: newAccount.created_at,
    };
  }

  async updateUsername(accountId: string, username: string): Promise<AccountDataReturn> {
    const trimmed = username.trim();
    if (!trimmed) {
      throw new WrongFormat('Adventurer name cannot be empty');
    }

    const existingUsername = await Account.findOne({
      where: {
        username: { [Op.iLike]: trimmed },
        id: { [Op.ne]: accountId },
      },
    });

    if (existingUsername) {
      throw new ExistData('Adventurer name already taken');
    }

    const account = await Account.findByPk(accountId);
    if (!account) {
      throw new DataNotFound('Account not found');
    }

    account.username = trimmed;
    await account.save();

    return {
      id: account.id,
      username: account.username,
      email: account.email,
      createdAt: account.created_at,
    };
  }

  async getAccountById(id: string): Promise<AccountDataReturn> {
    const account = await Account.findByPk(id);

    if (!account) {
      throw new DataNotFound('Account not found');
    }

    return {
      id: account.id,
      username: account.username,
      email: account.email,
      createdAt: account.created_at,
    };
  }

  async getAccountByIdentifier(identifier: string): Promise<AccountWithPassword> {
    const trimmed = identifier.trim();
    const account = await Account.findOne({
      where: {
        [Op.or]: [
          { email: trimmed.toLowerCase() },
          { username: trimmed },
        ],
      },
    });

    if (!account) {
      throw new DataNotFound('Account not found');
    }

    return {
      id: account.id,
      username: account.username,
      email: account.email,
      password: account.password,
      createdAt: account.created_at,
    };
  }
}
