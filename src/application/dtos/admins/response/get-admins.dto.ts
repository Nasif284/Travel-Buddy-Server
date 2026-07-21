export interface AdminData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}
export interface GetAdminsResponseDTO {
  admins: AdminData[];
}
