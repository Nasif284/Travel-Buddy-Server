import { GetAllUsersRequestDTO } from '../../dtos/user-management/request/get-users.dto';

import { User } from '../../../domain/entities/user/user.entity';
import { ChangeUserStatusRequestDTO } from '../../dtos/user-management/request/change-status.dto';
import { OnboardingSourceRequestDTO } from '../../dtos/onbaording/request/source.dto';
import { UserCardDetailsResponseDTO } from '../../dtos/users/response/user-card.dto';
import { NearbyUsersResponseDTO } from '../../dtos/users/response/nearby-users.dto';
import { GetUserProfileResponseDTO } from '../../dtos/users/response/user-profile.dto';

export interface CreateUserData {
  fullName: string;
  email: string;
  passwordHash?: string;
  avatarUrl?: string;
}

export interface UpdateLocationData {
  userId: string;
  latitude: number;
  longitude: number;
  city: string;
  countryCode: string;
}

export interface IUserRepository {
  findUserById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  createUser(data: CreateUserData): Promise<User>;
  updateEmailVerified(email: string): Promise<void>;
  updatePassword(id: string, password: string): Promise<void>;
  getAllUsers(payload: GetAllUsersRequestDTO): Promise<{
    users: User[];
    count: number;
  }>;
  changeUserStatus(payload: ChangeUserStatusRequestDTO): Promise<void>;
  addUserOnboardingSource(payload: OnboardingSourceRequestDTO): Promise<void>;
  updateUser(userId: string, payload: object): Promise<void>;
  createSkills(userId: string, skills: string[]): Promise<void>;
  createLanguages(userId: string, languages: string[]): Promise<void>;
  createTravelInterests(userId: string, interests: string[]): Promise<void>;
  updateOnboarding(userId: string, payload: object): Promise<void>;
  updateUserLocation(payload: UpdateLocationData): Promise<void>;
  getUserLocation(userId: string): Promise<{ lat: number; lang: number }>;
  getUsersForCard(
    currentUserId: string,
    params: { page: number; limit: number },
  ): Promise<UserCardDetailsResponseDTO>;
  getNearbyUsers(
    userId: string,
    page: number,
    limit: number,
    radiusKm?: number,
  ): Promise<NearbyUsersResponseDTO>;
  getUserWithDetails(userId: string): Promise<GetUserProfileResponseDTO>;
}
