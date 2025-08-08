import * as JD from "decoders"
import { TagName, tagNameDecoder } from "../../../Core/App/TagName"
import { Text256, text256Decoder } from "../../../Core/Data/Text"
import { Maybe, maybeDecoder } from "../../../Core/Data/Maybe"
import {
  Timestamp,
  timestampDecoderFromDate,
  toDate,
  createNow,
} from "../../../Core/Data/Timestamp"
import db from "../Database"
import * as Logger from "../Logger"

const tableName = "tag"

export type TagRow = {
  name: TagName
  description: Maybe<Text256>
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type CreateParams = {
  name: TagName
  description: Maybe<Text256>
}

export async function create(params: CreateParams): Promise<TagRow> {
  const { name, description } = params
  const now = toDate(createNow())

  return db
    .insertInto(tableName)
    .values({
      name: name.unwrap(),
      description: description != null ? description.unwrap() : null,
      createdAt: now,
      updatedAt: now,
    })
    .returningAll()
    .executeTakeFirstOrThrow()
    .then(tagRowDecoder.verify)
    .catch((e) => {
      Logger.error(`#${tableName}.create error ${e}`)
      throw e
    })
}

export async function unsafeCreate(row: TagRow): Promise<TagRow> {
  return db
    .insertInto(tableName)
    .values({
      name: row.name.unwrap(),
      description: row.description?.unwrap() || null,
      updatedAt: toDate(row.updatedAt),
      createdAt: toDate(row.createdAt),
    })
    .returningAll()
    .executeTakeFirstOrThrow()
    .then(tagRowDecoder.verify)
    .catch((e) => {
      Logger.error(`#${tableName}.unsafeCreate error ${e}`)
      throw e
    })
}

export const tagRowDecoder: JD.Decoder<TagRow> = JD.object({
  name: tagNameDecoder,
  description: maybeDecoder(text256Decoder),
  createdAt: timestampDecoderFromDate,
  updatedAt: timestampDecoderFromDate,
})
