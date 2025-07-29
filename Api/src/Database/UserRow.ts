import * as JD from "decoders"
import { Hash } from "../Data/Hash"
import { Email, emailDecoder } from "../../../Core/Data/User/Email"
import { Name, nameDecoder } from "../../../Core/App/User/Name"
import {
  createUserID,
  UserID,
  userIDDecoder,
} from "../../../Core/App/User/UserID"
import {
  createNow,
  Timestamp,
  timestampDecoderFromDate,
  toDate,
} from "../../../Core/Data/Timestamp"
import db from "../Database"
import * as Logger from "../Logger"
import { Nat, natDecoder } from "../../../Core/Data/Number/Nat"
import { Maybe } from "../../../Core/Data/Maybe"

const tableName = "user"

export type UserRow = {
  id: UserID
  email: Email
  name: Name
  password: string // hashed password
  isDeleted: boolean
  updatedAt: Timestamp
  createdAt: Timestamp
}

export type CreateParams = {
  email: Email
  name: Name
  hashedPassword: Hash
}
export async function create(params: CreateParams): Promise<UserRow> {
  const { email, name, hashedPassword } = params

  const now = toDate(createNow())
  return db
    .insertInto(tableName)
    .values({
      id: createUserID().unwrap(),
      email: email.unwrap(),
      name: name.unwrap(),
      password: hashedPassword.unwrap(),
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    })
    .returningAll()
    .executeTakeFirstOrThrow()
    .then(userRowDecoder.verify)
    .catch((e) => {
      Logger.error(`#${tableName}.create error ${e}`)
      throw e
    })
}

export async function getByID(userID: UserID): Promise<Maybe<UserRow>> {
  return db
    .selectFrom(tableName)
    .selectAll()
    .where("id", "=", userID.unwrap())
    .where("isDeleted", "=", false)
    .executeTakeFirst()
    .then((row) => (row == null ? null : userRowDecoder.verify(row)))
    .catch((e) => {
      Logger.error(`#${tableName}.getByID error ${e}`)
      throw e
    })
}

export async function getByEmail(email: Email): Promise<Maybe<UserRow>> {
  return db
    .selectFrom(tableName)
    .selectAll()
    .where("email", "=", email.unwrap())
    .where("isDeleted", "=", false)
    .executeTakeFirst()
    .then((row) => (row == null ? null : userRowDecoder.verify(row)))
    .catch((e) => {
      Logger.error(`#${tableName}.getByEmail error ${e}`)
      throw e
    })
}

export type UpdateParams = {
  name: Name
  email: Email
  newHashedPassword: Maybe<Hash>
}
export async function update(
  id: UserID,
  params: UpdateParams,
): Promise<UserRow> {
  const { name, email, newHashedPassword } = params

  const fields = {
    name: name.unwrap(),
    email: email.unwrap(),
    updatedAt: toDate(createNow()),
  }

  const fieldsWithPassword =
    newHashedPassword != null
      ? { ...fields, password: newHashedPassword.unwrap() }
      : fields

  return db
    .updateTable(tableName)
    .set(fieldsWithPassword)
    .where("id", "=", id.unwrap())
    .returningAll()
    .executeTakeFirstOrThrow()
    .then(userRowDecoder.verify)
    .catch((e) => {
      Logger.error(`#${tableName}.update error ${e}`)
      throw e
    })
}

export async function count(): Promise<Nat> {
  return db
    .selectFrom(tableName)
    .select([(b) => b.fn.count("id").as("total")])
    .executeTakeFirst()
    .then((r) => natDecoder.verify(Number(r?.total)))
    .catch((e) => {
      Logger.error(`#${tableName}.count error ${e}`)
      throw e
    })
}

/** Exported for testing */
export async function unsafeCreate(row: UserRow): Promise<UserRow> {
  return db
    .insertInto(tableName)
    .values({
      id: row.id.unwrap(),
      email: row.email.unwrap(),
      name: row.name.unwrap(),
      password: row.password,
      isDeleted: row.isDeleted,
      updatedAt: toDate(row.updatedAt),
      createdAt: toDate(row.createdAt),
    })
    .returningAll()
    .executeTakeFirstOrThrow()
    .then(userRowDecoder.verify)
    .catch((e) => {
      Logger.error(`#${tableName}.unsafeCreate error ${e}`)
      throw e
    })
}

export const userRowDecoder: JD.Decoder<UserRow> = JD.object({
  id: userIDDecoder,
  email: emailDecoder,
  name: nameDecoder,
  password: JD.string,
  isDeleted: JD.boolean,
  updatedAt: timestampDecoderFromDate,
  createdAt: timestampDecoderFromDate,
})
