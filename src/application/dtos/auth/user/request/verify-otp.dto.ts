import { z } from 'zod';
import { VerifyOtpSchema } from '../../../../../presentation/validators/user/auth/verify-otp.usecase';

export type VerifyOtpRequestDTO = z.infer<typeof VerifyOtpSchema>;
