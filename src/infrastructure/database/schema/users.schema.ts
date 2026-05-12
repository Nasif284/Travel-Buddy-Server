import {
  pgTable,
  uuid,
  varchar,
  boolean,
  text,
  date,
  timestamp,
  smallint,
  decimal,
} from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';
import {
  genders,
  travelTypes,
  travelPersonalities,
  matchPreferences,
  accountStatuses,
  onlineStatuses,
  onboardingSources,
  profileVisibilities,
  requestFromOptions,
} from './lookups.schema';
import { countries } from './references.schema';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: varchar('full_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  coverUrl: varchar('cover_url', { length: 500 }),
  bio: text('bio'),
  dateOfBirth: date('date_of_birth'),
  genderCode: varchar('gender_code', { length: 30 }).references(
    () => genders.code,
  ),
  countryCode: varchar('country_code', { length: 10 }).references(
    () => countries.code,
  ),
  travelTypeCode: varchar('travel_type_code', { length: 20 }).references(
    () => travelTypes.code,
  ),
  travelPersonalityCode: varchar('travel_personality_code', {
    length: 20,
  }).references(() => travelPersonalities.code),
  matchWithCode: varchar('match_with_code', { length: 20 })
    .default('everyone')
    .references(() => matchPreferences.code),
  accountStatusCode: varchar('account_status_code', { length: 20 })
    .default('active')
    .references(() => accountStatuses.code),
  isPhoneVerified: boolean('is_phone_verified').default(false),
  isEmailVerified: boolean('is_email_verified').default(false),
  isIdVerified: boolean('is_id_verified').default(false),
  phoneVerifiedAt: timestamp('phone_verified_at', { withTimezone: true }),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  idVerifiedAt: timestamp('id_verified_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).default(
    sql`now()`,
  ),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(
    sql`now()`,
  ),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const userOnboarding = pgTable('user_onboarding', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  onboardingStep: smallint('onboarding_step').default(1),
  onboardingCompleted: boolean('onboarding_completed').default(false),
  onboardingSourceCode: varchar('onboarding_source_code', {
    length: 50,
  }).references(() => onboardingSources.code),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(
    sql`now()`,
  ),
});

export const userPrivacySettings = pgTable('user_privacy_settings', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  profileVisibilityCode: varchar('profile_visibility_code', { length: 30 })
    .default('everyone')
    .references(() => profileVisibilities.code),
  requestsFromCode: varchar('requests_from_code', { length: 30 })
    .default('everyone')
    .references(() => requestFromOptions.code),
  showOnlineStatus: boolean('show_online_status').default(true),
  showTravelingStatus: boolean('show_traveling_status').default(false),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(
    sql`now()`,
  ),
});

export const userLanguages = pgTable('user_languages', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  language: varchar('language', { length: 100 }).notNull(),
});

export const userTravelSkills = pgTable('user_travel_skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  skill: varchar('skill', { length: 100 }).notNull(),
});

export const userInterests = pgTable('user_interests', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  interest: varchar('interest', { length: 100 }).notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  onboarding: one(userOnboarding, {
    fields: [users.id],
    references: [userOnboarding.userId],
  }),
  privacySettings: one(userPrivacySettings, {
    fields: [users.id],
    references: [userPrivacySettings.userId],
  }),
  languages: many(userLanguages),
  skills: many(userTravelSkills),
  interests: many(userInterests),
}));

export const userOnboardingRelations = relations(userOnboarding, ({ one }) => ({
  user: one(users, { fields: [userOnboarding.userId], references: [users.id] }),
}));

export const userPrivacySettingsRelations = relations(
  userPrivacySettings,
  ({ one }) => ({
    user: one(users, {
      fields: [userPrivacySettings.userId],
      references: [users.id],
    }),
  }),
);

export const userLanguagesRelations = relations(userLanguages, ({ one }) => ({
  user: one(users, {
    fields: [userLanguages.userId],
    references: [users.id],
  }),
}));

export const userTravelSkillsRelations = relations(
  userTravelSkills,
  ({ one }) => ({
    user: one(users, {
      fields: [userTravelSkills.userId],
      references: [users.id],
    }),
  }),
);

export const userInterestsRelations = relations(userInterests, ({ one }) => ({
  user: one(users, {
    fields: [userInterests.userId],
    references: [users.id],
  }),
}));
export type UserRecord = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserOnboardingRecord = typeof userOnboarding.$inferSelect;
export type NewUserOnboarding = typeof userOnboarding.$inferInsert;
export type UserPrivacyRecord = typeof userPrivacySettings.$inferSelect;
export type UserLanguageRecord = typeof userLanguages.$inferSelect;
export type UserInterestRecord = typeof userInterests.$inferSelect;
export type UserSkillRecord = typeof userTravelSkills.$inferSelect;
