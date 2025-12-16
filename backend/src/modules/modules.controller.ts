import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { User } from '../database/schema';
import { ProgressService } from '../progress/progress.service';

@Controller('modules')
@UseGuards(JwtAuthGuard)
export class ModulesController {
  constructor(
    private modulesService: ModulesService,
    private progressService: ProgressService,
  ) {}

  @Get()
  async findAll(@CurrentUser() user: User) {
    const modules = await this.modulesService.findAll();
    const progressData = await this.progressService.getUserProgress(user.id);

    return modules.map((module) => ({
      ...module,
      completed: progressData.completedModules.includes(module.id),
    }));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.modulesService.findWithResources(id);
  }
}
