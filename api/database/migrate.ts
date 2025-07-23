import * as path from "path"
import { promises } from "fs"
import { FileMigrationProvider, Migrator } from "kysely"
import db from "../src/Database"

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs: promises,
    path,
    migrationFolder: path.join(__dirname, "./migrations"),
  }),
  allowUnorderedMigrations: false,
})

migrator
  .migrateToLatest()
  .then(({ results, error }) => {
    if (error != null) throw error
    if (results == null) throw "No rollback results"

    if (results.length > 0) {
      results.forEach((r) => {
        switch (r.status) {
          case "Success":
            console.info(
              `Migration "${r.migrationName}" was executed successfully`,
            )
            break

          case "Error":
            console.error(
              `Migration "${r.migrationName}" was executed unsuccessfully`,
            )
            break

          case "NotExecuted":
            console.warn(`Migration "${r.migrationName}" was not executed`)
            break
        }
      })
    } else {
      console.info("Nothing to migrate")
    }

    process.exit(0)
  })
  .catch((error) => {
    console.error(`Migration error: ${error}`)
    process.exit(1)
  })
