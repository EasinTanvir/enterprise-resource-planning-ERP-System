import { ConfigService } from '@nestjs/config';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const DATABASE = Symbol('DATABASE');
export const DATABASE_POOL = Symbol('DATABASE_POOL');
export type Database = NodePgDatabase<typeof schema>;

export const databaseProviders = [
  {
    provide: DATABASE_POOL,
    inject: [ConfigService],
    useFactory: (configService: ConfigService): Pool => {
      const connectionString =
        configService.get<string>('DATABASE_APP_URL') ??
        configService.get<string>('DATABASE_URL');
      if (!connectionString)
        throw new Error(
          'DATABASE_APP_URL or DATABASE_URL must be configured before starting the API.',
        );
      return new Pool({ connectionString, max: 10, idleTimeoutMillis: 30_000 });
    },
  },
  {
    provide: DATABASE,
    inject: [DATABASE_POOL],
    useFactory: (pool: Pool): Database => drizzle({ client: pool, schema }),
  },
];
