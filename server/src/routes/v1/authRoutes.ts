import { Router } from 'express';
import { validateRequest } from '@/utils/middleware';
import {
  LoginSchema,
  VerifyOtpSchema,
  GetOtpSchema,
} from '@/schema/authSchema';
import AuthController from '@/controller/authController';

const authRoutes = Router();

authRoutes.post('/login', validateRequest(LoginSchema), AuthController.login);
authRoutes.post('/verify-otp', validateRequest(VerifyOtpSchema), AuthController.verifyOtp);
authRoutes.post('/get-otp', validateRequest(GetOtpSchema), AuthController.getOtp);
authRoutes.get('/token', AuthController.refreshToken);
authRoutes.post('/logout', AuthController.logout);

export default authRoutes;
