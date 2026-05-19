// prisma.admin.repository.ts

import { Admin, Prisma, PrismaClient } from '@prisma/client';

import { BaseRepository } from './base.repository';

import {
  CreateAdminData,
  IAdminRepository,
} from '../../../application/interfaces/repositories/admin.respository';

export class AdminRepository
  extends BaseRepository<
    Admin,
    Prisma.AdminCreateInput,
    Prisma.AdminUpdateInput
  >
  implements IAdminRepository
{
  constructor(prisma: PrismaClient) {
    super(prisma, prisma.admin);
  }

  async findById(id: string): Promise<Admin | null> {
    return super.findById(id);
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.findFirst({
      email,
    });
  }

  async createAdmin(data: CreateAdminData): Promise<Admin> {
    const role = await this.prisma.role.findFirst({
      where: {
        name: data.role,
      },
    });

    if (!role) {
      throw new Error('Invalid admin role');
    }

    return super.create({
      fullName: data.fullName,

      email: data.email,

      passwordHash: data.passwordHash,

      role: {
        connect: {
          id: role.id,
        },
      },
    });
  }
}
