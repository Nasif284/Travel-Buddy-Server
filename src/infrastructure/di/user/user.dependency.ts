import { container } from 'tsyringe';
import { GetUsersForCard } from '../../../application/use-cases/user/get-users-for-card.interface';
import { TOKENS } from '../tokens';
import { GetNearbyUsers } from '../../../application/use-cases/user/get-nearby-users.usecase';
import { GetUserProfile } from '../../../application/use-cases/user/get-user-profile.usecase';
import { GetMe } from '../../../application/use-cases/user/get-me.usecase';

export function registerUserDependency() {
  container.registerSingleton<GetUsersForCard>(
    TOKENS.IGetUsersForCard,
    GetUsersForCard,
  );
  container.registerSingleton<GetNearbyUsers>(
    TOKENS.IGetNearbyUsers,
    GetNearbyUsers,
  );
  container.registerSingleton<GetUserProfile>(
    TOKENS.IGetUserProfile,
    GetUserProfile,
  );
  container.registerSingleton<GetMe>(TOKENS.IGetMe, GetMe);
}
