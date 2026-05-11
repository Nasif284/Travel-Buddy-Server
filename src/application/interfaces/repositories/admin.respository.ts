import { AdminRecord } from '../../../infrastructure/database/schema';

export interface CreateAdminData {
  fullName: string;
  email: string;
  passwordHash: string;
  role: string;
}

export interface IAdminRepository {
  findById(id: string): Promise<AdminRecord | null>;
  findByEmail(email: string): Promise<AdminRecord | null>;
  create(data: CreateAdminData): Promise<AdminRecord>;
}
