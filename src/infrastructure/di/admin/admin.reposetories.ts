import { AdminRepository } from '../../database/repositories/admin.respository';
import { UserRepository } from '../../database/repositories/user.repository';
import { PrismaClient } from '@prisma/client';

export function BuildAdminRepositories(db: PrismaClient) {
  return {
    adminRepository: new AdminRepository(db),
    userRepository: new UserRepository(db),
  };
}
