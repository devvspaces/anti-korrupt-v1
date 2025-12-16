import { Injectable, Inject } from '@nestjs/common';
import { eq, and, ilike } from 'drizzle-orm';
import { DATABASE, type Database } from '../database/database.module';
import { searchableContent, resources } from '../database/schema';

@Injectable()
export class SearchService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async searchInModule(moduleId: number, query: string) {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchPattern = `%${query}%`;

    const results = await this.db
      .select({
        id: searchableContent.id,
        resourceId: searchableContent.resourceId,
        contentType: searchableContent.contentType,
        contentText: searchableContent.contentText,
        timestamp: searchableContent.timestamp,
        resourceTitle: resources.title,
        resourceType: resources.type,
      })
      .from(searchableContent)
      .innerJoin(resources, eq(searchableContent.resourceId, resources.id))
      .where(
        and(
          eq(searchableContent.moduleId, moduleId),
          ilike(searchableContent.contentText, searchPattern),
        ),
      )
      .limit(50);

    return results.map((result) => ({
      id: result.id,
      resourceId: result.resourceId,
      resourceTitle: result.resourceTitle,
      resourceType: result.resourceType,
      contentType: result.contentType,
      matchedText: this.extractMatchSnippet(result.contentText, query),
      timestamp: result.timestamp,
    }));
  }

  private extractMatchSnippet(text: string, query: string, contextLength: number = 100): string {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) {
      return text.substring(0, contextLength) + '...';
    }

    const start = Math.max(0, index - contextLength / 2);
    const end = Math.min(text.length, index + query.length + contextLength / 2);

    let snippet = text.substring(start, end);

    if (start > 0) {
      snippet = '...' + snippet;
    }

    if (end < text.length) {
      snippet = snippet + '...';
    }

    return snippet;
  }

  async indexContent(
    moduleId: number,
    resourceId: number,
    contentType: 'report' | 'video_subtitle' | 'audio_subtitle',
    contentText: string,
    timestamp?: number,
  ) {
    await this.db.insert(searchableContent).values({
      moduleId,
      resourceId,
      contentType,
      contentText,
      timestamp,
    });
  }

  async deleteModuleIndex(moduleId: number) {
    await this.db
      .delete(searchableContent)
      .where(eq(searchableContent.moduleId, moduleId));
  }
}
