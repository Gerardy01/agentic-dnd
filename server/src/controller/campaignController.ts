import { Request, Response } from 'express';
import { DataNotFound, WrongFormat } from '@/utils/exceptions';
import { campaignOrchestration } from '@/orchestration';

class CampaignController {
  static async createCampaign(req: Request, res: Response) {
    try {
      const accountId = req.user?.accountId || '';
      const { name, themePrompt, language } = req.body;

      const campaign = await campaignOrchestration.createCampaign(
        name,
        themePrompt,
        language || 'en',
        accountId
      );

      return res.status(201).json({
        status: 'success',
        message: 'Campaign created successfully',
        userMessage: '',
        data: campaign,
      });
    } catch (e) {
      if (e instanceof WrongFormat) {
        return res.status(422).json({
          status: 'failed',
          message: e.message,
          userMessage: '',
        });
      }

      if (e instanceof DataNotFound) {
        return res.status(404).json({
          status: 'failed',
          message: e.message,
          userMessage: e.message,
        });
      }

      return res.status(500).json({
        status: 'failed',
        message: 'Internal server error',
        userMessage: '500',
        errors: e,
      });
    }
  }
}

export default CampaignController;
