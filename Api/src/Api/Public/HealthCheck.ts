import type { Response } from "express"
import { createNow } from "../../../../Core/Data/Time/Timestamp"
import db from "../../Database"
import { sql } from "kysely"
import * as Logger from "../../Logger"

export async function handler(res: Response): Promise<void> {
  res.status(200).send({
    status: "ok",
    serverTime: createNow().unwrap(),
    database: await checkDB(),
  })
}

async function checkDB(): Promise<unknown> {
  return sql`SELECT 1 AS result`
    .execute(db)
    .then(() => "Ok")
    .catch((e) => Logger.fullErrorDetail(e))
}
