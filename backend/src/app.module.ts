import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ModulesModule } from './modules/modules.module';
import { ResourcesModule } from './resources/resources.module';
import { QuizModule } from './quiz/quiz.module';
import { ProgressModule } from './progress/progress.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    ModulesModule,
    ResourcesModule,
    QuizModule,
    ProgressModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
