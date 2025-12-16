import { pgTable, serial, integer, varchar, jsonb } from 'drizzle-orm/pg-core';
import { resources } from './resources.schema';
import { Subtitle } from './videos.schema';

export const audioFiles = pgTable('audio_files', {
  id: serial('id').primaryKey(),
  resourceId: integer('resource_id')
    .notNull()
    .references(() => resources.id, { onDelete: 'cascade' }),
  audioUrl: varchar('audio_url', { length: 500 }).notNull(),
  duration: varchar('duration', { length: 10 }),
  subtitles: jsonb('subtitles').$type<Subtitle[]>(),
  order: integer('order').notNull(),
});

export type AudioFile = typeof audioFiles.$inferSelect;
export type NewAudioFile = typeof audioFiles.$inferInsert;
