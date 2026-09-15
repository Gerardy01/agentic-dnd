import { Request, Response } from 'express';
import { DataNotFound, WrongFormat } from '@/utils/exceptions';
import { worldOrchestration } from '@/orchestration';

class WorldController {
  static async getAreas(req: Request, res: Response) {
    try {
      const accountId = req.user?.accountId || '';
      const rawCampaignId = req.params.campaignId || req.query.campaignId;
      const campaignId = Number(rawCampaignId);

      if (!rawCampaignId || isNaN(campaignId)) {
        return res.status(422).json({
          status: 'failed',
          message: 'campaignId is required and must be a valid number',
          userMessage: '',
        });
      }

      const data = await worldOrchestration.getAreas(campaignId, accountId);

      return res.status(200).json({
        status: 'success',
        message: 'Areas fetched successfully',
        userMessage: '',
        data,
      });
    } catch (e) {
      if (e instanceof DataNotFound) {
        return res.status(404).json({
          status: 'failed',
          message: e.message,
          userMessage: e.message,
        });
      }

      if (e instanceof WrongFormat) {
        return res.status(422).json({
          status: 'failed',
          message: e.message,
          userMessage: '',
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

export default WorldController;
