import { Prisma, PrismaClient, Admin as PrismaAdmin } from '@prisma/client';

import { BaseRepository } from './base.repository';

import {
  CreateAdminData,
  IAdminRepository,
} from '../../../application/interfaces/repositories/admin.respository';

import { Admin } from '../../../domain/entities/admin/admin.entity';

import { AdminMapper } from '../mappers/admin.mapper';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { GetAdminsResponseDTO } from '../../../application/dtos/admins/response/get-admins.dto';

@injectable()
export class AdminRepository
  extends BaseRepository<
    PrismaAdmin,
    Prisma.AdminCreateInput,
    Prisma.AdminUpdateInput
  >
  implements IAdminRepository
{
  constructor(@inject(TOKENS.PrismaClient) prisma: PrismaClient) {
    super(prisma, prisma.admin);
  }

  async findAdminById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({
      where: {
        id,
      },

      include: {
        role: true,
      },
    });

    if (!admin) {
      return null;
    }

    return AdminMapper.toDomain(admin);
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findFirst({
      where: {
        email,
      },

      include: {
        role: true,
      },
    });

    if (!admin) {
      return null;
    }

    return AdminMapper.toDomain(admin);
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

    const createdAdmin = await this.create({
      fullName: data.fullName,

      email: data.email,

      passwordHash: data.passwordHash,

      role: {
        connect: {
          id: role.id,
        },
      },
    });

    const adminWithRole = await this.prisma.admin.findUnique({
      where: {
        id: createdAdmin.id,
      },

      include: {
        role: true,
      },
    });

    if (!adminWithRole) {
      throw new Error('Admin creation failed');
    }

    return AdminMapper.toDomain(adminWithRole);
  }

  async getAdmins(): Promise<GetAdminsResponseDTO> {
    const admins = await this.prisma.admin.findMany({
      include: {
        role: true,
      },
    });
    return {
      admins: admins.map((a) => ({
        id: a.id,
        email: a.email,
        name: a.fullName,
        role: a.role.name,
        status: a.accountStatusCode,
      })),
    };
  }
}
