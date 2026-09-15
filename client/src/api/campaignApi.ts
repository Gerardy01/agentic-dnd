import { axiosPrivate } from '@/config/axiosConfig';
import { catchFetchError } from '@/utils/utility';
import type { FetchResponse, ErrorResponse } from '@/models/globalInterfaces';
import type { CreateCampaignDTO, InitiateCampaignReturn, CampaignListReturn } from '@/models/campaignInterfaces';

export class CampaignApi {
  async getCampaigns(): Promise<[undefined, CampaignListReturn[]] | [ErrorResponse]> {
    const [error, res] = await catchFetchError(
      axiosPrivate.get<FetchResponse<CampaignListReturn[]>>('/campaign')
    );

    if (error) return [error];
    return [undefined, res.data.data];
  }

  async getCampaignById(id: number): Promise<[undefined, CampaignListReturn] | [ErrorResponse]> {
    const [error, res] = await catchFetchError(
      axiosPrivate.get<FetchResponse<CampaignListReturn>>(`/campaign/${id}`)
    );

    if (error) return [error];
    return [undefined, res.data.data];
  }

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
