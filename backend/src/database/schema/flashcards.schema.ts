import { pgTable, serial, integer, text } from 'drizzle-orm/pg-core';
import { resources } from './resources.schema';

export const flashcards = pgTable('flashcards', {
  id: serial('id').primaryKey(),
  resourceId: integer('resource_id')
    .notNull()
    .references(() => resources.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  order: integer('order').notNull(),
});

export type Flashcard = typeof flashcards.$inferSelect;
export type NewFlashcard = typeof flashcards.$inferInsert;
