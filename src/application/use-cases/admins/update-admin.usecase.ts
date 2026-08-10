import { inject, injectable } from 'tsyringe';
import { IUpdateAdmin } from '../../interfaces/use-cases/admins/update-admin.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IAdminRepository } from '../../interfaces/repositories/admin.respository';
import { UpdateAdminRequestDTO } from '../../dtos/admins/request/update-admin.dto';
import { IHashService } from '../../interfaces/services/hash.service.interface';

@injectable()
export class UpdateAdmin implements IUpdateAdmin {
  constructor(
    @inject(TOKENS.IAdminRepository)
    private readonly _adminRepository: IAdminRepository,
    @inject(TOKENS.IHashService)
    private readonly _hashService: IHashService,
  ) {}
  async execute(dto: UpdateAdminRequestDTO): Promise<void> {
    if (dto.status?.statusCode) {
      await this._adminRepository.updateStatus(
        dto.adminId,
        dto.status,
        dto.actionedBy,
      );
    }
    if (dto.password) {
      const passwordHash = await this._hashService.hash(dto.password);
      await this._adminRepository.updatePassword(dto.adminId, passwordHash);
    }
    if (dto.role) {
      await this._adminRepository.updateRole(dto.adminId, dto.role);
    }
  }
}
