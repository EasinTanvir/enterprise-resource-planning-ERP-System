import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const connectionString =
  process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString)
  throw new Error(
    'DATABASE_URL_UNPOOLED (preferred) or DATABASE_URL must be set for Drizzle.',
  );

export default defineConfig({
  schema: './src/database/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: connectionString },
  strict: true,
  verbose: true,
});
