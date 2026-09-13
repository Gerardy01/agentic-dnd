import { axiosPrivate } from '@/config/axiosConfig';
import { catchFetchError } from '@/utils/utility';
import type { FetchResponse, ErrorResponse } from '@/models/globalInterfaces';
import type { CreateCampaignDTO, CampaignDataReturn } from '@/models/campaignInterfaces';

export class CampaignApi {
  async createCampaign(
    data: CreateCampaignDTO
  ): Promise<[undefined, CampaignDataReturn] | [ErrorResponse]> {
    const [error, res] = await catchFetchError(
      axiosPrivate.post<FetchResponse<CampaignDataReturn>>('/campaign', data)
    );

    if (error) return [error];
    return [undefined, res.data.data];
  }
}
