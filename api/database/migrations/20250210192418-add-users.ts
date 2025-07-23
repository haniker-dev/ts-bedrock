import { Kysely } from "kysely"

// Why `unknown`? Read more here https://kysely.dev/docs/migrations
export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "varchar(36)", (col) => col.primaryKey())
    .addColumn("email", "varchar(320)", (col) => col.notNull().unique())
    .addColumn("name", "varchar(100)", (col) => col.notNull())
    .addColumn("password", "varchar(100)", (col) => col.notNull())
    .addColumn("isDeleted", "boolean", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) => col.notNull())
    .addColumn("updatedAt", "timestamp", (col) => col.notNull())
    .execute()

  await db.schema
    .createTable("refresh_token")
    .addColumn("id", "varchar(36)", (col) => col.primaryKey())
    .addColumn("userID", "varchar(36)", (col) =>
      col.references("user.id").notNull().onDelete("cascade"),
    )
    .addColumn("previousID", "varchar(256)", (col) => col.notNull())
    .addColumn("previousCreatedAt", "timestamp", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
  // DEPRECATE We don't rollback database except during development
  // Once a migration is deployed on production,
  // we should revert this rollback to
  // throw new Error(
  //   "Do not rollback database. Push another migration to fix database migration.",
  // )

  await Promise.all([db.schema.dropTable("refresh_token").execute()])

  await Promise.all([db.schema.dropTable("user").execute()])
}
