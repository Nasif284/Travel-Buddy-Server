import {
  pgTable,
  varchar,
} from 'drizzle-orm/pg-core';


export const currencies = pgTable('currencies', {
  code: varchar('code', { length: 10 }).primaryKey(),
  symbol: varchar('symbol', { length: 10 }).notNull(),
});

export const countries = pgTable('countries', {
  code: varchar('code', { length: 10 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  phonePrefix: varchar('phone_prefix', { length: 10 }),
  flagEmoji: varchar('flag_emoji', { length: 10 }),
});


export type CurrencyRecord = typeof currencies.$inferSelect;
export type CountryRecord = typeof countries.$inferSelect;
