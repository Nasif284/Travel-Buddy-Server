export interface LoginResponseDTO {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      fullName: string;
      email: string;
      avatarUrl?: string | null;
    };
  };
}
