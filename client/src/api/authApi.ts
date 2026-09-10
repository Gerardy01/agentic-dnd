import { axiosPublic, axiosPrivate } from '@/config/axiosConfig';
import { catchFetchError } from '@/utils/utility';
import type { FetchResponse, ErrorResponse } from '@/models/globalInterfaces';
import type {
  LoginDTO,
  VerifyOtpDTO,
  GetOtpDTO,
  VerificationTokenReturn,
  TokenReturn,
} from '@/models/authInterfaces';

export class AuthApi {
  async login(data: LoginDTO): Promise<[undefined, VerificationTokenReturn] | [ErrorResponse]> {
    const [error, res] = await catchFetchError(
      axiosPublic.post<FetchResponse<VerificationTokenReturn>>('/login', data)
    );

    if (error) return [error];
    return [undefined, res.data.data];
  }

  async verifyOtp(data: VerifyOtpDTO): Promise<[undefined, TokenReturn] | [ErrorResponse]> {
    const [error, res] = await catchFetchError(
      axiosPublic.post<FetchResponse<TokenReturn>>('/verify-otp', data)
    );

    if (error) return [error];
    return [undefined, res.data.data];
  }

  async getOtp(data: GetOtpDTO): Promise<[undefined, boolean] | [ErrorResponse]> {
    const [error] = await catchFetchError(
      axiosPublic.post<FetchResponse<null>>('/get-otp', data)
    );

    if (error) return [error];
    return [undefined, true];
  }

  async refreshToken(): Promise<[undefined, TokenReturn] | [ErrorResponse]> {
    const [error, res] = await catchFetchError(
      axiosPrivate.get<FetchResponse<TokenReturn>>('/token', {
        withCredentials: true,
      })
    );

    if (error) return [error];
    return [undefined, res.data.data];
  }

  async logout(): Promise<[undefined, boolean] | [ErrorResponse]> {
    const [error] = await catchFetchError(
      axiosPrivate.post<FetchResponse<null>>('/logout')
    );

    if (error) return [error];
    return [undefined, true];
  }
}
