export interface CreateAdminResponseDTO {
  success: boolean;
  message: string;
  data: {
    admin: {
      id: string;
      email: string;
    };
  };
}
