import { Request, Response } from 'express';
import { DataNotFound } from '@/utils/exceptions';
import { spellOrchestration } from '@/orchestration';

class SpellController {
  static async getSpells(req: Request, res: Response) {
    try {
      const accountId = req.user?.accountId || '';
      const campaignId = Number(req.params.campaignId);

      if (!req.params.campaignId || isNaN(campaignId)) {
        return res.status(422).json({
          status: 'failed',
          message: 'campaignId is required and must be a valid number',
          userMessage: '',
        });
      }

      const data = await spellOrchestration.getSpells(campaignId, accountId);

      return res.status(200).json({
        status: 'success',
        message: 'Spells fetched successfully',
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

      return res.status(500).json({
        status: 'failed',
        message: 'Internal server error',
        userMessage: '500',
        errors: e,
      });
    }
  }
}

export default SpellController;
