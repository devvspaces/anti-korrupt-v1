import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DATABASE, type Database } from '../database/database.module';
import {
  resources,
  videos,
  quizzes,
  flashcards,
  slides,
  infographics,
  reports,
  audioFiles,
  games,
  quizQuestions,
  Resource,
} from '../database/schema';

@Injectable()
export class ResourcesService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async getResourceById(id: number): Promise<Resource> {
    const result = await this.db
      .select()
      .from(resources)
      .where(eq(resources.id, id))
      .limit(1);

    if (!result[0]) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    return result[0];
  }

  async getVideoResource(resourceId: number) {
    const video = await this.db
      .select()
      .from(videos)
      .where(eq(videos.resourceId, resourceId))
      .limit(1);

    if (!video[0]) {
      throw new NotFoundException(`Video not found for resource ${resourceId}`);
    }

    return video[0];
  }

  async getQuizResource(resourceId: number) {
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

  async getFlashcardsResource(resourceId: number) {
    return this.db
      .select()
      .from(flashcards)
      .where(eq(flashcards.resourceId, resourceId));
  }

  async getSlidesResource(resourceId: number) {
    const slide = await this.db
      .select()
      .from(slides)
      .where(eq(slides.resourceId, resourceId))
      .limit(1);

    if (!slide[0]) {
      throw new NotFoundException(`Slides not found for resource ${resourceId}`);
    }

    return slide[0];
  }

  async getInfographicsResource(resourceId: number) {
    return this.db
      .select()
      .from(infographics)
      .where(eq(infographics.resourceId, resourceId));
  }

  async getReportsResource(resourceId: number) {
    return this.db
      .select()
      .from(reports)
      .where(eq(reports.resourceId, resourceId));
  }

  async getAudioResource(resourceId: number) {
    return this.db
      .select()
      .from(audioFiles)
      .where(eq(audioFiles.resourceId, resourceId));
  }

  async getGameResource(resourceId: number) {
    const game = await this.db
      .select()
      .from(games)
      .where(eq(games.resourceId, resourceId))
      .limit(1);

    if (!game[0]) {
      throw new NotFoundException(`Game not found for resource ${resourceId}`);
    }

    return game[0];
  }
}
