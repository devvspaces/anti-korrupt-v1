import { pgTable, serial, integer, varchar, jsonb } from 'drizzle-orm/pg-core';
import { resources } from './resources.schema';

export interface Subtitle {
  start: number;
  end: number;
  text: string;
}

export const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
  resourceId: integer('resource_id')
    .notNull()
    .unique()
    .references(() => resources.id, { onDelete: 'cascade' }),
  videoUrl: varchar('video_url', { length: 500 }).notNull(),
  duration: varchar('duration', { length: 10 }),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  subtitles: jsonb('subtitles').$type<Subtitle[]>(),
});

export type Video = typeof videos.$inferSelect;
export type NewVideo = typeof videos.$inferInsert;
