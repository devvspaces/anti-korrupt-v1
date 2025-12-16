import { pgTable, serial, integer, varchar } from 'drizzle-orm/pg-core';
import { resources } from './resources.schema';

export const slides = pgTable('slides', {
  id: serial('id').primaryKey(),
  resourceId: integer('resource_id')
    .notNull()
    .unique()
    .references(() => resources.id, { onDelete: 'cascade' }),
  pdfUrl: varchar('pdf_url', { length: 500 }).notNull(),
  pageCount: integer('page_count'),
});

export type Slide = typeof slides.$inferSelect;
export type NewSlide = typeof slides.$inferInsert;
