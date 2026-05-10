import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
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

export const adminRoles = pgTable('admin_roles', {
  adminId: uuid('admin_id')
    .notNull()
    .references(() => admins.id, { onDelete: 'cascade' }),
  roleId: uuid('role_id')
    .notNull()
    .references(() => roles.id, { onDelete: 'cascade' }),
  grantedBy: uuid('granted_by').references(() => admins.id),
  grantedAt: timestamp('granted_at', { withTimezone: true }).default(
    sql`now()`,
  ),
});


export const adminsRelations = relations(admins, ({ many }) => ({
  roles: many(adminRoles),
}));

export const adminRolesRelations = relations(adminRoles, ({ one }) => ({
  admin: one(admins, { fields: [adminRoles.adminId], references: [admins.id] }),
  role: one(roles, { fields: [adminRoles.roleId], references: [roles.id] }),
}));


export type RoleRecord = typeof roles.$inferSelect;
export type AdminRecord = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
export type AdminRoleRecord = typeof adminRoles.$inferSelect;
