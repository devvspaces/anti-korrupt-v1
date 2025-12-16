import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { User } from '../database/schema';
import { UsersService } from '../users/users.service';

@Controller('users/me/progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(
    private progressService: ProgressService,
    private usersService: UsersService,
  ) {}

  @Get()
  async getProgress(@CurrentUser() user: User) {
    const progress = await this.progressService.getUserProgress(user.id);
    const currentUser = await this.usersService.findById(user.id);

    return {
      ...progress,
      knowledgeTokens: currentUser?.knowledgeTokens || 0,
    };
  }
}
