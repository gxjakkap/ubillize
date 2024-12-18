import * as dotenv from "dotenv"
import { defineConfig } from 'drizzle-kit'

dotenv.config()


export default defineConfig({
  out: './drizzle',
  schema: './src/schema.ts' ,
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
