import { AuthApi } from './authApi';
import { AccountApi } from './accountApi';
import { CampaignApi } from './campaignApi';
import { FactionApi } from './factionApi';
import { WorldApi } from './worldApi';
import { ClassApi } from './classApi';

export const authApi = new AuthApi();
export const accountApi = new AccountApi();
export const campaignApi = new CampaignApi();
export const factionApi = new FactionApi();
export const worldApi = new WorldApi();
export const classApi = new ClassApi();


