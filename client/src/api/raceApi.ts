import { axiosPrivate } from '@/config/axiosConfig';
import { catchFetchError } from '@/utils/utility';
import type { FetchResponse, ErrorResponse } from '@/models/globalInterfaces';
import type { RaceDataReturn } from '@/models/raceInterfaces';

export class RaceApi {
  async getRaces(campaignId: number): Promise<[undefined, RaceDataReturn[]] | [ErrorResponse]> {
    const [error, res] = await catchFetchError(
      axiosPrivate.get<FetchResponse<RaceDataReturn[]>>(`/race/${campaignId}`)
    );

    if (error) return [error];
    return [undefined, res.data.data];
  }
}
