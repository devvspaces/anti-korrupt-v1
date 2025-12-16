import { pgTable, serial, integer, text } from 'drizzle-orm/pg-core';
import { resources } from './resources.schema';

export const quizzes = pgTable('quizzes', {
  id: serial('id').primaryKey(),
  resourceId: integer('resource_id')
    .notNull()
    .unique()
    .references(() => resources.id, { onDelete: 'cascade' }),
  passingScore: integer('passing_score').default(80).notNull(),
  questionsPerAttempt: integer('questions_per_attempt').default(5).notNull(),
});

export const quizQuestions = pgTable('quiz_questions', {
  id: serial('id').primaryKey(),
  quizId: integer('quiz_id')
    .notNull()
    .references(() => quizzes.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  options: text('options').array().notNull(),
  correctAnswer: integer('correct_answer').notNull(),
  hint: text('hint'),
  correctExplanation: text('correct_explanation'),
  incorrectExplanation: text('incorrect_explanation'),
});

export type Quiz = typeof quizzes.$inferSelect;
export type NewQuiz = typeof quizzes.$inferInsert;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type NewQuizQuestion = typeof quizQuestions.$inferInsert;
