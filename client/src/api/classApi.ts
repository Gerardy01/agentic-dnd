import { axiosPrivate } from '@/config/axiosConfig';
import { catchFetchError } from '@/utils/utility';
import type { FetchResponse, ErrorResponse } from '@/models/globalInterfaces';
import type { ClassDataReturn } from '@/models/classInterfaces';

export class ClassApi {
  async getClasses(campaignId: number): Promise<[undefined, ClassDataReturn[]] | [ErrorResponse]> {
    const [error, res] = await catchFetchError(
      axiosPrivate.get<FetchResponse<ClassDataReturn[]>>(`/class/${campaignId}`)
    );

    if (error) return [error];
    return [undefined, res.data.data];
  }
}
