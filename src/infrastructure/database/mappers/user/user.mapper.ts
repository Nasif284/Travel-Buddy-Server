// src/infrastructure/database/mappers/UserMapper.ts

import { User, UserProps } from '../../../../domain/entities/user/user.entity';
import {
  AccountStatus,
  Gender,
  TravelType,
  TravelPersonality,
  MatchPreference,
  ProfileVisibility,
  RequestFromOption,
  OnboardingSource,
} from '../../../../domain/enums';
import type {
  UserRecord,
  UserOnboardingRecord,
  UserPrivacyRecord,
} from '../../schema';

type UserWithRelations = UserRecord & {
  onboarding?: UserOnboardingRecord | null;
  privacySettings?: UserPrivacyRecord | null;
};

export class UserMapper {
  static toDomain(row: UserWithRelations): User {
    const props: UserProps = {
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      passwordHash: row.passwordHash,
      avatarUrl: row.avatarUrl,
      coverUrl: row.coverUrl,
      bio: row.bio,
      dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth) : null,
      genderCode: (row.genderCode as Gender) ?? null,
      countryCode: row.countryCode,
      travelTypeCode: (row.travelTypeCode as TravelType) ?? null,
      travelPersonalityCode:
        (row.travelPersonalityCode as TravelPersonality) ?? null,
      matchWithCode:
        (row.matchWithCode as MatchPreference) ?? MatchPreference.EVERYONE,
      accountStatusCode:
        (row.accountStatusCode as AccountStatus) ?? AccountStatus.ACTIVE,
      isPhoneVerified: row.isPhoneVerified ?? false,
      isEmailVerified: row.isEmailVerified ?? false,
      isIdVerified: row.isIdVerified ?? false,
      phoneVerifiedAt: row.phoneVerifiedAt,
      emailVerifiedAt: row.emailVerifiedAt,
      idVerifiedAt: row.idVerifiedAt,
      createdAt: row.createdAt!,
      updatedAt: row.updatedAt!,
      deletedAt: row.deletedAt,

      privacy: row.privacySettings
        ? {
            profileVisibilityCode:
              (row.privacySettings
                .profileVisibilityCode as ProfileVisibility) ??
              ProfileVisibility.EVERYONE,
            requestsFromCode:
              (row.privacySettings.requestsFromCode as RequestFromOption) ??
              RequestFromOption.EVERYONE,
            showOnlineStatus: row.privacySettings.showOnlineStatus ?? true,
            showTravelingStatus:
              row.privacySettings.showTravelingStatus ?? false,
          }
        : undefined,
      onboarding: row.onboarding
        ? {
            onboardingStep: row.onboarding.onboardingStep ?? 1,
            onboardingCompleted: row.onboarding.onboardingCompleted ?? false,
            onboardingSourceCode:
              (row.onboarding.onboardingSourceCode as OnboardingSource) ?? null,
          }
        : undefined,
    };

    return new User(props);
  }
}
