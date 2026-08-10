import { inject, injectable } from 'tsyringe';
import { ISaveAdminActivity } from '../../interfaces/use-cases/admins/admin-activity.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IAdminRepository } from '../../interfaces/repositories/admin.respository';
import { ICacheService } from '../../interfaces/services/cache.service.interface';

@injectable()
export class SaveAdminActivity implements ISaveAdminActivity {
  constructor(
    @inject(TOKENS.IAdminRepository)
    private readonly _adminRepository: IAdminRepository,

    @inject(TOKENS.ICacheService)
    private readonly _cacheService: ICacheService,
  ) {}

  async execute(dto: { adminId: string; ip: string }) {
    const key = `admin:last-active:${dto.adminId}`;

    if (await this._cacheService.exists(key)) {
      return;
    }

    await this._adminRepository.updateLastActive(dto.adminId, dto.ip);
    await this._cacheService.set(key, 300, dto.ip);
  }
}
