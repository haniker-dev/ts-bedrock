import { Kysely } from "kysely"

// Why `unknown`? Read more here https://kysely.dev/docs/migrations
export async function up(_db: Kysely<unknown>): Promise<void> {
  // Add your migration here
}

export async function down(_db: Kysely<unknown>): Promise<void> {
  throw new Error(
    "Do not rollback database. Push another migration to fix database migration.",
  )
}
