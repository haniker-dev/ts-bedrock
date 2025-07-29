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
  .migrateDown()
  .then(({ results, error }) => {
    if (error != null) throw error
    if (results == null) throw "No rollback results"
    if (results.length > 1) throw "Rollback only apply for Initial Migration"

    const result = results[0]
    if (result != null) {
      switch (result.status) {
        case "Success":
          console.info("Rollback was executed successfully")
          break
        case "Error":
        case "NotExecuted":
          throw `Something went wrong with rollback: ${JSON.stringify(
            result,
            null,
            2,
          )}`
      }
    } else {
      console.info("Nothing to rollback")
    }

    process.exit(0)
  })
  .catch((error) => {
    console.error(`Rollback error: ${error}`)
    process.exit(1)
  })
