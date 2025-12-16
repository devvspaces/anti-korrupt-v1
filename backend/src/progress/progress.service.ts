import { Injectable, Inject } from '@nestjs/common';
import { eq, and, count } from 'drizzle-orm';
import { DATABASE, type Database } from '../database/database.module';
import { userModuleProgress, modules } from '../database/schema';

@Injectable()
export class ProgressService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async getUserProgress(userId: number) {
    // Get completed modules
    const completedModulesData = await this.db
      .select({ moduleId: userModuleProgress.moduleId })
      .from(userModuleProgress)
      .where(
        and(
          eq(userModuleProgress.userId, userId),
          eq(userModuleProgress.completed, true),
        ),
      );

    const completedModules = completedModulesData.map((row) => row.moduleId);

    // Get total module count
    const totalModulesResult = await this.db
      .select({ count: count() })
      .from(modules);

    const totalModules = totalModulesResult[0]?.count || 0;
    const completedCount = completedModules.length;
    const progress = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

    return {
      totalModules,
      completedCount,
      progress,
      completedModules,
    };
  }

  async markModuleComplete(userId: number, moduleId: number): Promise<void> {
    // Check if record exists
    const existing = await this.db
      .select()
      .from(userModuleProgress)
      .where(
        and(
          eq(userModuleProgress.userId, userId),
          eq(userModuleProgress.moduleId, moduleId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing record
      await this.db
        .update(userModuleProgress)
        .set({
          completed: true,
          completedAt: new Date(),
        })
        .where(
          and(
            eq(userModuleProgress.userId, userId),
            eq(userModuleProgress.moduleId, moduleId),
          ),
        );
    } else {
      // Create new record
      await this.db.insert(userModuleProgress).values({
        userId,
        moduleId,
        completed: true,
        completedAt: new Date(),
      });
    }
  }

  async isModuleCompleted(userId: number, moduleId: number): Promise<boolean> {
    const result = await this.db
      .select()
      .from(userModuleProgress)
      .where(
        and(
          eq(userModuleProgress.userId, userId),
          eq(userModuleProgress.moduleId, moduleId),
          eq(userModuleProgress.completed, true),
        ),
      )
      .limit(1);

    return result.length > 0;
  }
}
