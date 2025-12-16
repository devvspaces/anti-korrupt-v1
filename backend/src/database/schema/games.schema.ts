import { pgTable, serial, integer, jsonb } from 'drizzle-orm/pg-core';
import { resources } from './resources.schema';

export interface CrosswordClue {
  number: number;
  direction: 'across' | 'down';
  clue: string;
  answer: string;
  startRow: number;
  startCol: number;
}

export const games = pgTable('games', {
  id: serial('id').primaryKey(),
  resourceId: integer('resource_id')
    .notNull()
    .unique()
    .references(() => resources.id, { onDelete: 'cascade' }),
  gridSize: integer('grid_size').notNull(),
  clues: jsonb('clues').$type<CrosswordClue[]>().notNull(),
});

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
