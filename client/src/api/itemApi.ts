import { axiosPrivate } from '@/config/axiosConfig';
import { catchFetchError } from '@/utils/utility';
import type { FetchResponse, ErrorResponse } from '@/models/globalInterfaces';
import type { ItemDataReturn } from '@/models/itemInterfaces';

export class ItemApi {
  async getItems(campaignId: number): Promise<[undefined, ItemDataReturn[]] | [ErrorResponse]> {
    const [error, res] = await catchFetchError(
      axiosPrivate.get<FetchResponse<ItemDataReturn[]>>(`/item/${campaignId}`)
    );

    if (error) return [error];
    return [undefined, res.data.data];
  }
}
