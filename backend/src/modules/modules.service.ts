import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, asc } from 'drizzle-orm';
import { DATABASE, type Database } from '../database/database.module';
import { modules, Module, resources } from '../database/schema';

@Injectable()
export class ModulesService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async findAll(): Promise<Module[]> {
    return this.db.select().from(modules).orderBy(asc(modules.order));
  }

  async findById(id: number): Promise<Module> {
    const result = await this.db
      .select()
      .from(modules)
      .where(eq(modules.id, id))
      .limit(1);

    if (!result[0]) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    return result[0];
  }

  async findByOrder(order: number): Promise<Module | undefined> {
    const result = await this.db
      .select()
      .from(modules)
      .where(eq(modules.order, order))
      .limit(1);

    return result[0];
  }

  async findWithResources(id: number) {
    const module = await this.findById(id);

    const moduleResources = await this.db
      .select()
      .from(resources)
      .where(eq(resources.moduleId, id))
      .orderBy(asc(resources.order));

    return {
      ...module,
      resources: moduleResources,
    };
  }
}
