import { inject, injectable } from 'tsyringe';
import { IAuthMe } from '../../../interfaces/use-cases/auth/user/auth-me.interface';
import { TOKENS } from '../../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../interfaces/repositories/user.reposetory';
import { UserNotFoundError } from '../../../../domain/errors/auth.error';
import { IStorageService } from '../../../interfaces/services/storage.service.interface';
import { AuthResponseDTO } from '../../../dtos/auth/user/responce/login.dto';
@injectable()
export class AuthMe implements IAuthMe {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}
  async execute(dto: { userId: string }): Promise<AuthResponseDTO> {
    const user = await this._userRepository.findUserById(dto.userId, {
      onboarding: true,
    });
    if (!user) throw new UserNotFoundError();
    return {
      response: {
        isVerified: user.isEmailVerified,
        onboardingCompleted: user.onboarding.onboardingCompleted,
        onboardingStep: user.onboarding.onboardingStep,
        user: {
          email: user.email,
          fullName: user.fullName,
          id: user.id,
        },
      },
    };
  }
}
