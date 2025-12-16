import { pgTable, serial, integer, varchar } from 'drizzle-orm/pg-core';
import { resources } from './resources.schema';

export const infographics = pgTable('infographics', {
  id: serial('id').primaryKey(),
  resourceId: integer('resource_id')
    .notNull()
    .references(() => resources.id, { onDelete: 'cascade' }),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  order: integer('order').notNull(),
});

export type Infographic = typeof infographics.$inferSelect;
export type NewInfographic = typeof infographics.$inferInsert;
