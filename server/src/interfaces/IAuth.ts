export interface RegisterDTO {
  email: string;
  password: string;
}

export interface LoginDTO {
  identifier: string;
  password: string;
}

export interface VerifyOtpDTO {
  code: number;
  verificationToken: string;
}

export interface GetOtpDTO {
  email: string;
}

export interface AccessTokenBody {
  accountId: string;
  email: string;
  username: string;
}

export interface VerificationTokenBody {
  email: string;
  type: 'verification';
}

export type VerificationTokenReturn = {
  verificationToken: string;
};

export type TokenReturn = {
  accessToken: string;
};
