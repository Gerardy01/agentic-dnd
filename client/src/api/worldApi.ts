import { axiosPrivate } from '@/config/axiosConfig';
import { catchFetchError } from '@/utils/utility';
import type { FetchResponse, ErrorResponse } from '@/models/globalInterfaces';
import type { AreaWithDetailsReturn } from '@/models/worldInterfaces';

export class WorldApi {
  async getAreas(campaignId: number): Promise<[undefined, AreaWithDetailsReturn[]] | [ErrorResponse]> {
    const [error, res] = await catchFetchError(
      axiosPrivate.get<FetchResponse<AreaWithDetailsReturn[]>>(`/world/area/${campaignId}`)
    );

    if (error) return [error];
    return [undefined, res.data.data];
  }
}
