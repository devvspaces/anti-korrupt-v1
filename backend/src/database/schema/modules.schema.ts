import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const modules = pgTable('modules', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  order: integer('order').notNull().unique(),
  characterVideoUrl: varchar('character_video_url', { length: 500 }),
  overview: text('overview'),
  objectives: text('objectives').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Module = typeof modules.$inferSelect;
export type NewModule = typeof modules.$inferInsert;
