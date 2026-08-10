export interface AdminData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: Date;
  ip: string;
}
export interface GetAdminsResponseDTO {
  admins: AdminData[];
}
