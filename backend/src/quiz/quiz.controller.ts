import { Controller, Get, Post, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { User } from '../database/schema';

@Controller('quizzes')
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Get(':id/questions')
  async getQuestions(@Param('id', ParseIntPipe) quizId: number) {
    return this.quizService.getRandomQuestions(quizId);
  }

  @Post(':id/attempts')
  async submitAttempt(
    @Param('id', ParseIntPipe) quizId: number,
    @Body() submitQuizDto: SubmitQuizDto,
    @CurrentUser() user: User,
  ) {
    return this.quizService.submitQuizAttempt(user.id, quizId, submitQuizDto.answers);
  }

  @Get(':id/attempts')
  async getAttempts(@Param('id', ParseIntPipe) quizId: number, @CurrentUser() user: User) {
    return this.quizService.getUserAttempts(user.id, quizId);
  }
}
