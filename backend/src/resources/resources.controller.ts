import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('resources')
@UseGuards(JwtAuthGuard)
export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {}

  @Get('videos/:id')
  async getVideo(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.getVideoResource(id);
  }

  @Get('quizzes/:id')
  async getQuiz(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.getQuizResource(id);
  }

  @Get('flashcards/:id')
  async getFlashcards(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.getFlashcardsResource(id);
  }

  @Get('slides/:id')
  async getSlides(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.getSlidesResource(id);
  }

  @Get('infographics/:id')
  async getInfographics(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.getInfographicsResource(id);
  }

  @Get('reports/:id')
  async getReports(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.getReportsResource(id);
  }

  @Get('audio/:id')
  async getAudio(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.getAudioResource(id);
  }

  @Get('games/:id')
  async getGame(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.getGameResource(id);
  }
}
