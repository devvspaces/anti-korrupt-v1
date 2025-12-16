import { pgTable, serial, integer, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { modules } from './modules.schema';

export const resourceTypeEnum = pgEnum('resource_type', [
  'video',
  'flashcard',
  'quiz',
  'slides',
  'infographics',
  'report',
  'audio',
  'game',
]);

export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  moduleId: integer('module_id')
    .notNull()
    .references(() => modules.id, { onDelete: 'cascade' }),
  type: resourceTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;
export type ResourceType = Resource['type'];
