import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { drizzle } from 'drizzle-orm/node-postgres/driver'
import { resolve } from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: resolve('../../.env') })

const db = drizzle(process.env.DATABASE_URL!)

async function runMigrations() {
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations completed!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

runMigrations()