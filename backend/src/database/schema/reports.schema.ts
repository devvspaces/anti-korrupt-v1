import { pgTable, serial, integer, text } from 'drizzle-orm/pg-core';
import { resources } from './resources.schema';

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  resourceId: integer('resource_id')
    .notNull()
    .references(() => resources.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  order: integer('order').notNull(),
});

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
