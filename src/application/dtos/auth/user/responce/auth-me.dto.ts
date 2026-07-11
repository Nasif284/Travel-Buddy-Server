import { User } from '@prisma/client';

export interface AuthMeResponseDTO {
  response: {
    user: User;
    isVerified: boolean;
    onboardingCompleted: boolean;
    onboardingStep: number;
  };
}
