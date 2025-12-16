import {
  pgTable,
  serial,
  integer,
  jsonb,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { quizzes } from './quizzes.schema';

export interface QuizAnswers {
  [questionId: number]: number; // questionId -> selected option index
}

export const quizAttempts = pgTable('quiz_attempts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  quizId: integer('quiz_id')
    .notNull()
    .references(() => quizzes.id, { onDelete: 'cascade' }),
  selectedQuestions: jsonb('selected_questions').$type<number[]>().notNull(),
  answers: jsonb('answers').$type<QuizAnswers>().notNull(),
  score: integer('score').notNull(),
  passed: boolean('passed').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type NewQuizAttempt = typeof quizAttempts.$inferInsert;
