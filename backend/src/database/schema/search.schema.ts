import { pgTable, serial, integer, text, timestamp, pgEnum, index } from 'drizzle-orm/pg-core';
import { modules } from './modules.schema';
import { resources } from './resources.schema';

export const contentTypeEnum = pgEnum('content_type', ['report', 'video_subtitle', 'audio_subtitle']);

export const searchableContent = pgTable(
  'searchable_content',
  {
    id: serial('id').primaryKey(),
    moduleId: integer('module_id')
      .notNull()
      .references(() => modules.id, { onDelete: 'cascade' }),
    resourceId: integer('resource_id')
      .notNull()
      .references(() => resources.id, { onDelete: 'cascade' }),
    contentType: contentTypeEnum('content_type').notNull(),
    contentText: text('content_text').notNull(),
    timestamp: integer('timestamp'), // For subtitles (in seconds)
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    moduleIdIdx: index('searchable_content_module_id_idx').on(table.moduleId),
    contentTextIdx: index('searchable_content_text_idx').on(table.contentText),
  }),
);

export type SearchableContent = typeof searchableContent.$inferSelect;
export type NewSearchableContent = typeof searchableContent.$inferInsert;
