import { Admin } from '@prisma/client';

export interface CreateAdminData {
  fullName: string;
  email: string;
  passwordHash: string;
  role: string;
}

export interface IAdminRepository {
  findById(id: string): Promise<Admin | null>;
  findByEmail(email: string): Promise<Admin | null>;
  createAdmin(data: CreateAdminData): Promise<Admin>;
}
