import { Global, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export const DATABASE = Symbol('DATABASE');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/anti_korrupt_db';

const client = postgres(connectionString, { max: 10 });
const db = drizzle(client, { schema });

const databaseProvider = {
  provide: DATABASE,
  useValue: db,
};

@Global()
@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}

export type Database = typeof db;
