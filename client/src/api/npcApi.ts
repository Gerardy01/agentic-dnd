import { axiosPrivate } from '@/config/axiosConfig';
import { catchFetchError } from '@/utils/utility';
import type { FetchResponse, ErrorResponse } from '@/models/globalInterfaces';
import type { NpcWithDetailsReturn } from '@/models/npcInterfaces';

export class NpcApi {
  async getNpcs(campaignId: number): Promise<[undefined, NpcWithDetailsReturn[]] | [ErrorResponse]> {
    const [error, res] = await catchFetchError(
      axiosPrivate.get<FetchResponse<NpcWithDetailsReturn[]>>(`/npc/${campaignId}`)
    );

    if (error) return [error];
    return [undefined, res.data.data];
  }
}
