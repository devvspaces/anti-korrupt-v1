import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DATABASE, type Database } from '../database/database.module';
import { users, User, NewUser } from '../database/schema';

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async findByLastName(lastName: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.lastName, lastName))
      .limit(1);

    return result[0];
  }

  async findById(id: number): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return result[0];
  }

  async create(data: NewUser): Promise<User> {
    const result = await this.db
      .insert(users)
      .values(data)
      .returning();

    return result[0];
  }

  async updateKnowledgeTokens(userId: number, tokens: number): Promise<User> {
    const result = await this.db
      .update(users)
      .set({
        knowledgeTokens: tokens,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return result[0];
  }

  async incrementKnowledgeTokens(userId: number, increment: number = 1): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return this.updateKnowledgeTokens(userId, user.knowledgeTokens + increment);
  }
}
