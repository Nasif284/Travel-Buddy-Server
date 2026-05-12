export interface EmailVerificationResponseDTO {
  success: boolean;
  message: string;
  data: {
    email: string;
  };
}
