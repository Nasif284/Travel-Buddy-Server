import { inject, injectable } from 'tsyringe';
import { BcryptHashService } from '../../../../infrastructure/services';
import { CreateAdminRequestDTO } from '../../../dtos/auth/admin/request/create-admin.dto';
import { CreateAdminResponseDTO } from '../../../dtos/auth/admin/response/create-admin.dto';
import { IAdminRepository } from '../../../interfaces/repositories/admin.respository';
import { ICreate } from '../../../interfaces/use-cases/auth/admin/create.interface';
import { TOKENS } from '../../../../infrastructure/di/tokens';
@injectable()
export class CreateAdmin implements ICreate {
  constructor(
    @inject(TOKENS.IAdminRepository)
    private readonly _adminRepository: IAdminRepository,
    @inject(TOKENS.IHashService)
    private readonly _hashService: BcryptHashService,
  ) {}
  async execute(dto: CreateAdminRequestDTO): Promise<CreateAdminResponseDTO> {
    const { fullName, email, password, role } = dto;
    const passwordHash = await this._hashService.hash(password);
    const admin = await this._adminRepository.createAdmin({
      fullName,
      email,
      passwordHash,
      role,
    });
    return {
      admin: {
        id: admin.id,
        email: admin.email,
      },
    };
  }
}
