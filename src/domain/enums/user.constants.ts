export enum AccountStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  DEACTIVATED = 'deactivated',
}
export enum OnlineStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non_binary',
}

export enum TravelType {
  BUDGET = 'budget',
  BACKPACKER = 'backpacker',
  LUXURY = 'luxury',
}

export enum TravelPersonality {
  INTROVERT = 'introvert',
  AMBIVERT = 'ambivert',
  EXTROVERT = 'extrovert',
}

export enum MatchPreference {
  MEN = 'men',
  WOMEN = 'women',
  EVERYONE = 'everyone',
}

export enum ProfileVisibility {
  EVERYONE = 'everyone',
  VERIFIED_ONLY = 'verified_only',
  CONNECTED_ONLY = 'connected_only',
}

export enum RequestFromOption {
  EVERYONE = 'everyone',
  VERIFIED_ONLY = 'verified_only',
  NOBODY = 'nobody',
}

export enum OnboardingSource {
  FRIENDS = 'friends',
  SOCIAL_MEDIA = 'social_media',
  SEARCH_ENGINE = 'search_engine',
  TRAVEL_BLOG = 'travel_blog',
  APP_STORE = 'app_store',
  OTHER = 'other',
}

export type OtpPurpose = 'phone_verify' | 'password_reset' | 'email_verify';
