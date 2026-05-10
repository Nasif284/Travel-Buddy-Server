import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const genders = pgTable('genders', {
  code: varchar('code', { length: 30 }).primaryKey(),
});

export const travelTypes = pgTable('travel_types', {
  code: varchar('code', { length: 20 }).primaryKey(),
});

export const travelPersonalities = pgTable('travel_personalities', {
  code: varchar('code', { length: 20 }).primaryKey(),
});

export const matchPreferences = pgTable('match_preferences', {
  code: varchar('code', { length: 20 }).primaryKey(),
});

export const accountStatuses = pgTable('account_statuses', {
  code: varchar('code', { length: 20 }).primaryKey(),
});

export const onlineStatuses = pgTable('online_statuses', {
  code: varchar('code', { length: 20 }).primaryKey(),
});

export const onboardingSources = pgTable('onboarding_sources', {
  code: varchar('code', { length: 50 }).primaryKey(),
});

export const profileVisibilities = pgTable('profile_visibilities', {
  code: varchar('code', { length: 30 }).primaryKey(),
});

export const requestFromOptions = pgTable('request_from_options', {
  code: varchar('code', { length: 30 }).primaryKey(),
});
