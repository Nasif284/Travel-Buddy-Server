import { Admin } from '../../../domain/entities/admin/admin.entity';
import { UpdateAdminStatusDTO } from '../../dtos/admins/request/update-admin.dto';
import { GetAdminsResponseDTO } from '../../dtos/admins/response/get-admins.dto';

export interface CreateAdminData {
  fullName: string;
  email: string;
  passwordHash: string;
  role: string;
}

export interface UpdateProfileData {
  name: string;
}

export interface IAdminRepository {
  findAdminById(id: string): Promise<Admin | null>;
  findByEmail(email: string): Promise<Admin | null>;
  createAdmin(data: CreateAdminData): Promise<Admin>;
  getAdmins(): Promise<GetAdminsResponseDTO>;
  updateLastActive(adminId: string, ip: string): Promise<void>;
  updateRole(adminId: string, role: string): Promise<void>;
  updatePassword(adminId: string, passwordHash: string): Promise<void>;
  updateStatus(
    adminId: string,
    statusCode: UpdateAdminStatusDTO,
    actionedBy: string,
  ): Promise<void>;
}
