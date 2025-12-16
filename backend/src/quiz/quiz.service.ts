import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DATABASE, type Database } from '../database/database.module';
import { quizzes, quizQuestions, quizAttempts, resources, QuizQuestion } from '../database/schema';
import { ProgressService } from '../progress/progress.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class QuizService {
  constructor(
    @Inject(DATABASE) private db: Database,
    private progressService: ProgressService,
    private usersService: UsersService,
  ) {}

  async getQuizByResourceId(resourceId: number) {
    const quiz = await this.db
      .select()
      .from(quizzes)
      .where(eq(quizzes.resourceId, resourceId))
      .limit(1);

    if (!quiz[0]) {
      throw new NotFoundException(`Quiz not found for resource ${resourceId}`);
    }

    return quiz[0];
  }

  async getRandomQuestions(quizId: number) {
    const quiz = await this.db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, quizId))
      .limit(1);

    if (!quiz[0]) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
    }

    // Get all questions for this quiz
    const allQuestions = await this.db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId));

    if (allQuestions.length === 0) {
      throw new BadRequestException('Quiz has no questions');
    }

    const questionsPerAttempt = quiz[0].questionsPerAttempt;
    const numToSelect = Math.min(questionsPerAttempt, allQuestions.length);

    // Shuffle and select random questions
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, numToSelect);

    // Remove correct answers from response (client shouldn't know yet)
    return selectedQuestions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      hint: q.hint,
      // Don't send correct answer or explanations
    }));
  }

  async submitQuizAttempt(
    userId: number,
    quizId: number,
    answers: { [questionId: number]: number },
  ) {
    const quiz = await this.db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, quizId))
      .limit(1);

    if (!quiz[0]) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
    }

    // Get all questions that were answered
    const questionIds = Object.keys(answers).map(Number);
    const questions = await this.db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId));

    const questionMap = new Map<number, QuizQuestion>();
    questions.forEach((q) => questionMap.set(q.id, q));

    // Calculate score and generate feedback
    let correctCount = 0;
    const feedback: any[] = [];

    for (const [questionIdStr, selectedOption] of Object.entries(answers)) {
      const questionId = Number(questionIdStr);
      const question = questionMap.get(questionId);

      if (!question) {
        throw new BadRequestException(`Question ${questionId} not found in quiz`);
      }

      const isCorrect = selectedOption === question.correctAnswer;
      if (isCorrect) {
        correctCount++;
      }

      feedback.push({
        questionId,
        question: question.question,
        selectedOption,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: isCorrect
          ? question.correctExplanation
          : question.incorrectExplanation,
      });
    }

    const totalQuestions = questionIds.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= quiz[0].passingScore;

    // Save attempt
    await this.db.insert(quizAttempts).values({
      userId,
      quizId,
      selectedQuestions: questionIds,
      answers,
      score,
      passed,
      submittedAt: new Date(),
    });

    // If passed, mark module as complete and award knowledge token
    if (passed) {
      // Get the module ID from the resource
      const resource = await this.db
        .select()
        .from(resources)
        .where(eq(resources.id, quiz[0].resourceId))
        .limit(1);

      if (resource[0]) {
        const moduleId = resource[0].moduleId;

        // Check if module was already completed
        const wasCompleted = await this.progressService.isModuleCompleted(userId, moduleId);

        // Mark module complete
        await this.progressService.markModuleComplete(userId, moduleId);

        // Award knowledge token only if not previously completed
        if (!wasCompleted) {
          await this.usersService.incrementKnowledgeTokens(userId, 1);
        }
      }
    }

    return {
      score,
      passed,
      correctCount,
      totalQuestions,
      feedback,
    };
  }

  async getUserAttempts(userId: number, quizId: number) {
    return this.db
      .select()
      .from(quizAttempts)
      .where(
        eq(quizAttempts.userId, userId),
      );
  }
}
