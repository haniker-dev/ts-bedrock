import { Kysely } from "kysely"

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("post")
    .addColumn("id", "varchar(36)", (col) => col.primaryKey())
    .addColumn("title", "varchar(256)", (col) => col.notNull())
    .addColumn("content", "text", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) => col.notNull())
    .addColumn("updatedAt", "timestamp", (col) => col.notNull())
    .execute()

  await db.schema
    .createTable("tag")
    .addColumn("name", "varchar(100)", (col) => col.primaryKey())
    .addColumn("description", "varchar(256)") // nullable
    .addColumn("createdAt", "timestamp", (col) => col.notNull())
    .addColumn("updatedAt", "timestamp", (col) => col.notNull())
    .execute()

  await db.schema
    .createTable("post_tag")
    .addColumn("postID", "varchar(36)", (col) =>
      col
        .references("post.id")
        .onDelete("cascade")
        .onUpdate("cascade")
        .notNull(),
    )
    .addColumn("tagName", "varchar(100)", (col) =>
      col
        .references("tag.name")
        .onDelete("cascade")
        .onUpdate("cascade")
        .notNull(),
    )
    .addPrimaryKeyConstraint("post_tag_pkey", ["postID", "tagName"])
    .execute()

  await db.schema
    .createTable("comment")
    .addColumn("id", "varchar(36)", (col) => col.primaryKey())
    .addColumn("postID", "varchar(36)", (col) =>
      col
        .references("post.id")
        .onDelete("cascade")
        .onUpdate("cascade")
        .notNull(),
    )
    .addColumn("userID", "varchar(36)", (col) =>
      col
        .references("user.id")
        .onDelete("cascade")
        .onUpdate("cascade")
        .notNull(),
    )
    .addColumn("content", "varchar(1024)", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("comment").execute()
  await db.schema.dropTable("post_tag").execute()
  await db.schema.dropTable("tag").execute()
  await db.schema.dropTable("post").execute()
}
