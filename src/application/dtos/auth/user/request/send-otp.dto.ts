import { z } from 'zod';
import { SendOtpSchema } from '../../../../../presentation/validators/user/auth/send-otp.validator';

export type SendOtpRequestDTO = z.infer<typeof SendOtpSchema>;
