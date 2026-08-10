export interface UpdateAdminStatusDTO {
  statusCode: string;
  reason?: string;
}

export interface UpdateAdminRequestDTO {
  adminId: string;
  actionedBy: string;
  role?: string;
  status?: UpdateAdminStatusDTO;
  password?: string;
}
