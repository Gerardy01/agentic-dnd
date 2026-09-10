export interface CreateAccountDTO {
  email: string;
  password: string;
}

export interface UpdateUsernameDTO {
  username: string;
}

export type AccountDataReturn = {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
};

export type AccountWithPassword = AccountDataReturn & {
  password: string;
};

export type CreateAccountReturn = {
  verificationToken: string;
};

export type UpdateUsernameReturn = {
  account: AccountDataReturn;
  accessToken: string;
};
