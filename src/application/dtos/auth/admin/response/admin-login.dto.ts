export interface AdminLoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  response: {
    admin: {
      id: string;
      fullName: string;
      email: string;
      role: string;
    };
  };
}
