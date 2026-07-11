export interface AuthResponseDTO {
  response: {
    user: {
      id: string;
      fullName: string;
      email: string;
      avatarUrl?: string | null;
    };
    isVerified: boolean;
    onboardingCompleted: boolean;
    onboardingStep: number;
  };
}
export interface LoginResponseDTO extends AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
}
