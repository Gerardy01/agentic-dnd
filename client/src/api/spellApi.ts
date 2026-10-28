import { axiosPrivate } from '@/config/axiosConfig';
import { catchFetchError } from '@/utils/utility';
import type { FetchResponse, ErrorResponse } from '@/models/globalInterfaces';
import type { SpellDataReturn } from '@/models/spellInterfaces';

export class SpellApi {
  async getSpells(campaignId: number): Promise<[undefined, SpellDataReturn[]] | [ErrorResponse]> {
    const [error, res] = await catchFetchError(
      axiosPrivate.get<FetchResponse<SpellDataReturn[]>>(`/spell/${campaignId}`)
    );

    if (error) return [error];
    return [undefined, res.data.data];
  }
}
