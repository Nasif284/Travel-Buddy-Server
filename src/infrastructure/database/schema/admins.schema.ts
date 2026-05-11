import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';
import { accountStatuses } from './lookups.schema';

export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 60 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).default(
    sql`now()`,
  ),
});

export const admins = pgTable('admins', {
  id: uuid('id').primaryKey().defaultRandom(),

  roleId: uuid('role_id')
    .notNull()
    .references(() => roles.id),

  fullName: varchar('full_name', { length: 100 }).notNull(),

  email: varchar('email', { length: 255 }).notNull().unique(),

  passwordHash: varchar('password_hash', { length: 255 }).notNull(),

  accountStatusCode: varchar('account_status_code', { length: 20 })
    .default('active')
    .references(() => accountStatuses.code),

  avatarUrl: varchar('avatar_url', { length: 500 }),

  lastActiveAt: timestamp('last_active_at', { withTimezone: true }),

  createdBy: uuid('created_by').references((): any => admins.id),

  createdAt: timestamp('created_at', { withTimezone: true }).default(
    sql`now()`,
  ),

  updatedAt: timestamp('updated_at', { withTimezone: true }).default(
    sql`now()`,
  ),
});

export const adminsRelations = relations(admins, ({ one }) => ({
  role: one(roles, {
    fields: [admins.roleId],
    references: [roles.id],
  }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  admins: many(admins),
}));

export type RoleRecord = typeof roles.$inferSelect;
export type AdminRecord = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
