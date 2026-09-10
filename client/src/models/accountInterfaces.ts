export interface CreateAccountDTO {
  email: string;
  password: string;
}

export interface UpdateUsernameDTO {
  username: string;
}

export interface AccountStateDTO {
  accountId: string;
  username: string;
  email: string;
}

export type AccountDataReturn = {
  id: string;
  username: string;
  email: string;
};

export type CreateAccountReturn = {
  verificationToken: string;
};

export type UpdateUsernameReturn = {
  account: AccountDataReturn;
  accessToken: string;
};
