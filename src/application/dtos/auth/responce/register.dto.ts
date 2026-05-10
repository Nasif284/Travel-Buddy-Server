export interface RegisterResponseDTO {
  success:boolean,
  message: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}
