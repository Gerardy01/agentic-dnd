import { Request, Response } from 'express';
import { authOrchestration } from '@/orchestration';
import { DataNotFound, WrongFormat, NotValid } from '@/utils/exceptions';

class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const data = await authOrchestration.login(req.body);

      return res.status(200).json({
        status: 'success',
        message: 'Credentials verified. Verification OTP sent.',
        userMessage: '',
        data,
      });
    } catch (e) {
      if (e instanceof DataNotFound || e instanceof WrongFormat) {
        return res.status(401).json({
          status: 'failed',
          message: 'Invalid username/email or password',
          userMessage: 'AUTH003',
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

  static async verifyOtp(req: Request, res: Response) {
    try {
      const userAgent = req.headers['user-agent'] || undefined;
      const { accessToken, refreshToken } = await authOrchestration.verifyOtp(req.body, userAgent);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(200).json({
        status: 'success',
        message: 'OTP verified successfully',
        userMessage: '',
        data: { accessToken },
      });
    } catch (e) {
      if (e instanceof WrongFormat || e instanceof NotValid) {
        return res.status(400).json({
          status: 'failed',
          message: e.message,
          userMessage: 'AUTH004',
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

  static async getOtp(req: Request, res: Response) {
    try {
      await authOrchestration.resendOtp(req.body);

      return res.status(200).json({
        status: 'success',
        message: 'New OTP code sent to your email',
        userMessage: '',
      });
    } catch (e) {
      if (e instanceof DataNotFound) {
        return res.status(404).json({
          status: 'failed',
          message: 'Account not found for provided email',
          userMessage: 'AUTH005',
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

  static async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          status: 'failed',
          message: 'Refresh token cookie not provided',
          userMessage: 'AUTH006',
        });
      }

      const data = await authOrchestration.refreshAccessToken(refreshToken);

      return res.status(200).json({
        status: 'success',
        message: 'Access token refreshed successfully',
        userMessage: '',
        data,
      });
    } catch (e) {
      if (e instanceof NotValid || e instanceof DataNotFound) {
        return res.status(401).json({
          status: 'failed',
          message: 'Invalid or expired refresh token',
          userMessage: 'AUTH007',
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

  static async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken ?? '';

      await authOrchestration.logout(refreshToken);

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
        userMessage: '',
      });
    } catch (e) {
      if (e instanceof NotValid) {
        return res.status(401).json({
          status: 'failed',
          message: e.message,
          userMessage: 'AUTH007',
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

export default AuthController;
