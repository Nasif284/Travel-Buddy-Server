import { BcryptHashService } from '../../../../infrastructure/services';
import { CreateAdminRequestDTO } from '../../../dtos/admin/request/create-admin.dto';
import { CreateAdminResponseDTO } from '../../../dtos/admin/response/create-admin.dto';
import { IBaseUseCase } from '../../../interfaces/base-usecase.interface';
import { IAdminRepository } from '../../../interfaces/repositories/admin.respository';

export class CreateAdmin implements IBaseUseCase<
  CreateAdminRequestDTO,
  CreateAdminResponseDTO
> {
  constructor(
    private readonly _adminRepository: IAdminRepository,
    private readonly _hashService: BcryptHashService,
  ) {}
  async execute(dto: CreateAdminRequestDTO): Promise<CreateAdminResponseDTO> {
    const { fullName, email, password, role } = dto;
    const passwordHash = await this._hashService.hash(password);
    const admin = await this._adminRepository.create({
      fullName,
      email,
      passwordHash,
      role,
    });
    return {
      success: true,
      message: 'Admin created successfully',
      data: {
        admin: {
          id: admin.id,
          email: admin.email,
        },
      },
    };
  }
}
