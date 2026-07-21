import { inject, injectable } from 'tsyringe';
import { IGetAdmins } from '../../interfaces/use-cases/admins/get-admins.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IAdminRepository } from '../../interfaces/repositories/admin.respository';
import { GetAdminsResponseDTO } from '../../dtos/admins/response/get-admins.dto';
@injectable()
export class GetAdmins implements IGetAdmins {
  constructor(
    @inject(TOKENS.IAdminRepository)
    private readonly _adminRepository: IAdminRepository,
  ) {}
  async execute(): Promise<GetAdminsResponseDTO> {
    return await this._adminRepository.getAdmins();
  }
}
