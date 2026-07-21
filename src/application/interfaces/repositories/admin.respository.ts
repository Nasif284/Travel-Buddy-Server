import { Admin } from '../../../domain/entities/admin/admin.entity';
import {
  AdminData,
  GetAdminsResponseDTO,
} from '../../dtos/admins/response/get-admins.dto';

export interface CreateAdminData {
  fullName: string;
  email: string;
  passwordHash: string;
  role: string;
}

export interface IAdminRepository {
  findAdminById(id: string): Promise<Admin | null>;
  findByEmail(email: string): Promise<Admin | null>;
  createAdmin(data: CreateAdminData): Promise<Admin>;
  getAdmins(): Promise<GetAdminsResponseDTO>;
}
