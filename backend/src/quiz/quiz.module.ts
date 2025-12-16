import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { ProgressModule } from '../progress/progress.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ProgressModule, UsersModule],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
