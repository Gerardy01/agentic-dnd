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

export type VerificationTokenReturn = {
  verificationToken: string;
};

export type TokenReturn = {
  accessToken: string;
};
