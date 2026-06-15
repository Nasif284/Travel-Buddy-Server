import { GetUsersForCardRequestDTO } from '../../../dtos/users/request/user-card.dto';
import { UserCardDetailsResponseDTO } from '../../../dtos/users/response/user-card.dto';

export interface IGetUsersForCard {
  execute(dto: GetUsersForCardRequestDTO): Promise<UserCardDetailsResponseDTO>;
}
