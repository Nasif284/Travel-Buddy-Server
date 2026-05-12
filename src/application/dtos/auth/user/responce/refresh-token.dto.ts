export interface RefreshTokenResponseDTO {
  accessToken: string;
  refreshToken: string;
  response: {
    success: boolean;
    message: string;
    data: {
      user: {
        id: string;
        fullName: string;
        email: string;
      };
    };
  };
}
