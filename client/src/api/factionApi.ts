import { axiosPrivate } from '@/config/axiosConfig';
import { catchFetchError } from '@/utils/utility';
import type { FetchResponse, ErrorResponse } from '@/models/globalInterfaces';
import type { FactionDataReturn } from '@/models/factionInterfaces';

export class FactionApi {
  async getFactions(campaignId: number): Promise<[undefined, FactionDataReturn[]] | [ErrorResponse]> {
    const [error, res] = await catchFetchError(
      axiosPrivate.get<FetchResponse<FactionDataReturn[]>>(`/faction/${campaignId}`)
    );

    if (error) return [error];
    return [undefined, res.data.data];
  }
}
