import { pgTable, serial, integer, boolean, timestamp, unique } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { modules } from './modules.schema';

export const userModuleProgress = pgTable(
  'user_module_progress',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    moduleId: integer('module_id')
      .notNull()
      .references(() => modules.id, { onDelete: 'cascade' }),
    completed: boolean('completed').default(false).notNull(),
    completedAt: timestamp('completed_at'),
  },
  (table) => ({
    userModuleUnique: unique().on(table.userId, table.moduleId),
  }),
);

export type UserModuleProgress = typeof userModuleProgress.$inferSelect;
export type NewUserModuleProgress = typeof userModuleProgress.$inferInsert;
