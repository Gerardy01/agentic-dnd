import { Request, Response } from 'express';
import { DataNotFound, WrongFormat } from '@/utils/exceptions';
import { campaignOrchestration } from '@/orchestration';

class CampaignController {
  /**
   * Non-blocking campaign creation initiation.
   * Delegates entirely to orchestration, which generates processId via service/provider
   * and initializes progress streaming.
   */
  static async createCampaign(req: Request, res: Response) {
    try {
      const accountId = req.user?.accountId || '';
      const { name, themePrompt, language } = req.body;

      const data = campaignOrchestration.initiateCampaignCreation(
        name,
        themePrompt,
        language || 'en',
        accountId
      );

      return res.status(202).json({
        status: 'success',
        message: 'Campaign generation initiated',
        userMessage: '',
        data,
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

  /**
   * SSE endpoint for streaming campaign generation progress.
   * Delegates stream connection to orchestration.
   */
  static async getCampaignProgress(req: Request, res: Response) {
    try {
      const accountId = req.user?.accountId || '';
      const processId = Array.isArray(req.params.processId)
        ? req.params.processId[0]
        : req.params.processId;

      if (!processId) {
        return res.status(400).json({
          status: 'failed',
          message: 'processId is required',
          userMessage: '',
        });
      }

      const connected = campaignOrchestration.streamProgress(processId, accountId, res);

      if (!connected) {
        return res.status(404).json({
          status: 'failed',
          message: 'Process channel not found or expired',
          userMessage: '',
        });
      }
    } catch (e) {
      return res.status(500).json({
        status: 'failed',
        message: 'Internal server error',
        userMessage: '500',
        errors: e,
      });
    }
  }

  /**
   * Retrieves list of campaigns belonging to the authenticated account.
   */
  static async getCampaigns(req: Request, res: Response) {
    try {
      const accountId = req.user?.accountId || '';
      const data = await campaignOrchestration.getCampaigns(accountId);

      return res.status(200).json({
        status: 'success',
        message: 'Campaigns fetched successfully',
        userMessage: '',
        data,
      });
    } catch (e) {
      return res.status(500).json({
        status: 'failed',
        message: 'Internal server error',
        userMessage: '500',
        errors: e,
      });
    }
  }

  /**
   * Retrieves a single campaign by ID.
   */
  static async getCampaignById(req: Request, res: Response) {
    try {
      const accountId = req.user?.accountId || '';
      const campaignId = Number(req.params.id);

      if (!campaignId || isNaN(campaignId)) {
        return res.status(422).json({
          status: 'failed',
          message: 'Valid campaign ID is required',
          userMessage: '',
        });
      }

      const data = await campaignOrchestration.getCampaignById(campaignId, accountId);

      return res.status(200).json({
        status: 'success',
        message: 'Campaign fetched successfully',
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

export default CampaignController;
