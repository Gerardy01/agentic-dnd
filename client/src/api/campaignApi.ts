import { axiosPrivate } from '@/config/axiosConfig';
import { catchFetchError } from '@/utils/utility';
import type { FetchResponse, ErrorResponse } from '@/models/globalInterfaces';
import type { CreateCampaignDTO, InitiateCampaignReturn } from '@/models/campaignInterfaces';

export class CampaignApi {
  async createCampaign(
    data: CreateCampaignDTO
  ): Promise<[undefined, InitiateCampaignReturn] | [ErrorResponse]> {
    const [error, res] = await catchFetchError(
      axiosPrivate.post<FetchResponse<InitiateCampaignReturn>>('/campaign', data)
    );

    if (error) return [error];
    return [undefined, res.data.data];
  }
}
