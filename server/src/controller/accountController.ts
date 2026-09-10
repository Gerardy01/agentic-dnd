import { Request, Response } from 'express';
import { accountOrchestration } from '@/orchestration';
import { ExistData, DataNotFound, WrongFormat } from '@/utils/exceptions';

class AccountController {
  static async createAccount(req: Request, res: Response) {
    try {
      const data = await accountOrchestration.createAccount(req.body);

      return res.status(201).json({
        status: 'success',
        message: 'Account created successfully. Verification OTP sent.',
        userMessage: '',
        data,
      });
    } catch (e) {
      if (e instanceof ExistData) {
        return res.status(409).json({
          status: 'failed',
          message: e.message,
          userMessage: 'ACCOUNT001',
        });
      }

      if (e instanceof WrongFormat) {
        return res.status(422).json({
          status: 'failed',
          message: e.message,
          userMessage: 'ACCOUNT002',
        });
      }

      return res.status(500).json({
        status: 'failed',
        message: 'Internal server error',
        userMessage: '500',
        errors: e instanceof Error ? e.message : e,
      });
    }
  }

  static async getAccount(req: Request, res: Response) {
    try {
      const accountId = req.user?.accountId || '';
      const data = await accountOrchestration.getAccount(accountId);

      return res.status(200).json({
        status: 'success',
        message: 'Account details fetched successfully',
        userMessage: '',
        data,
      });
    } catch (e) {
      if (e instanceof DataNotFound) {
        return res.status(404).json({
          status: 'failed',
          message: 'Account not found',
          userMessage: 'ACCOUNT003',
        });
      }

      return res.status(500).json({
        status: 'failed',
        message: 'Internal server error',
        userMessage: '500',
        errors: e instanceof Error ? e.message : e,
      });
    }
  }

  static async updateUsername(req: Request, res: Response) {
    try {
      const accountId = req.user?.accountId || '';
      const { username } = req.body;
      const data = await accountOrchestration.updateUsername(accountId, username);

      return res.status(200).json({
        status: 'success',
        message: 'Adventurer name updated successfully',
        userMessage: '',
        data,
      });
    } catch (e) {
      if (e instanceof ExistData) {
        return res.status(409).json({
          status: 'failed',
          message: e.message,
          userMessage: 'ACCOUNT004',
        });
      }

      if (e instanceof WrongFormat) {
        return res.status(422).json({
          status: 'failed',
          message: e.message,
          userMessage: 'ACCOUNT002',
        });
      }

      if (e instanceof DataNotFound) {
        return res.status(404).json({
          status: 'failed',
          message: e.message,
          userMessage: 'ACCOUNT003',
        });
      }

      return res.status(500).json({
        status: 'failed',
        message: 'Internal server error',
        userMessage: '500',
        errors: e instanceof Error ? e.message : e,
      });
    }
  }
}

export default AccountController;
