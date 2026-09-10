import { axiosPublic, axiosPrivate } from '@/config/axiosConfig';
import { catchFetchError } from '@/utils/utility';
import type { FetchResponse, ErrorResponse } from '@/models/globalInterfaces';
import type {
  CreateAccountDTO,
  CreateAccountReturn,
  AccountDataReturn,
  UpdateUsernameDTO,
  UpdateUsernameReturn,
} from '@/models/accountInterfaces';

export class AccountApi {
  async createAccount(
    data: CreateAccountDTO
  ): Promise<[undefined, CreateAccountReturn] | [ErrorResponse]> {
    const [error, res] = await catchFetchError(
      axiosPublic.post<FetchResponse<CreateAccountReturn>>('/account', data)
    );

    if (error) return [error];
    return [undefined, res.data.data];
  }

  async getAccount(): Promise<[undefined, AccountDataReturn] | [ErrorResponse]> {
    const [error, res] = await catchFetchError(
      axiosPrivate.get<FetchResponse<AccountDataReturn>>('/account/me')
    );

    if (error) return [error];
    return [undefined, res.data.data];
  }

  async updateUsername(
    data: UpdateUsernameDTO
  ): Promise<[undefined, UpdateUsernameReturn] | [ErrorResponse]> {
    const [error, res] = await catchFetchError(
      axiosPrivate.patch<FetchResponse<UpdateUsernameReturn>>('/account/username', data)
    );

    if (error) return [error];
    return [undefined, res.data.data];
  }
}
