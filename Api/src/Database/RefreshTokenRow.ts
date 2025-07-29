import * as JD from "decoders"
import * as Logger from "../Logger"
import { UserID, userIDDecoder } from "../../../Core/App/User/UserID"
import {
  createNow,
  createTimestampE,
  diffFromNow,
  fromDate,
  Timestamp,
  toDate,
} from "../../../Core/Data/Timestamp"
import {
  createRefreshToken,
  RefreshToken,
  refreshTokenDecoder,
} from "../../../Core/Data/Security/RefreshToken"
import db from "../Database"

const tableName = "refresh_token"

/** RefreshToken has a 90 days expiry **/
export const refreshTokenExpiryMS = 90 * 24 * 60 * 60 * 1000

/**
 * There is a racing condition where a user is refreshing the token
 * but network issue prevented the user from receiving the new token.
 * Hence, we have to store the previous refreshToken
 * so that user can still use the previous refreshToken to get a new token.
 */
export type RefreshTokenRow = {
  id: RefreshToken
  previousID: RefreshToken
  previousCreatedAt: Timestamp
  userID: UserID
  createdAt: Timestamp
}

/** We don't remove other RefreshToken of the same userID
 * as we want to allow multiple device login
 **/
export async function create(userID: UserID): Promise<RefreshToken> {
  const now = toDate(createNow())
  const refreshToken = createRefreshToken()
  return db
    .insertInto(tableName)
    .values({
      id: refreshToken.unwrap(),
      previousID: refreshToken.unwrap(),
      previousCreatedAt: now,
      userID: userID.unwrap(),
      createdAt: now,
    })
    .executeTakeFirstOrThrow()
    .then(() => refreshToken)
    .catch((e) => {
      Logger.error(`#${tableName}.create error ${e}`)
      throw e
    })
}

/** Update a new RefreshTokenRow with the old RefreshTokenRow as previousID */
export async function replace(row: RefreshTokenRow): Promise<RefreshTokenRow> {
  const now = toDate(createNow())
  const refreshToken = createRefreshToken()
  return db
    .updateTable(tableName)
    .set({
      id: refreshToken.unwrap(),
      userID: row.userID.unwrap(),
      previousID: row.id.unwrap(),
      previousCreatedAt: toDate(row.createdAt),
      createdAt: now,
    })
    .where("id", "=", row.id.unwrap())
    .where("userID", "=", row.userID.unwrap())
    .returningAll()
    .executeTakeFirstOrThrow()
    .then(rowDecoder.verify)
    .catch((e) => {
      Logger.error(`#${tableName}.create error ${e}`)
      throw e
    })
}

export function isExpired(row: RefreshTokenRow): boolean {
  return Math.abs(diffFromNow(row.createdAt)) > refreshTokenExpiryMS
}

export function isExpiredPrevious(row: RefreshTokenRow): boolean {
  return Math.abs(diffFromNow(row.previousCreatedAt)) > refreshTokenExpiryMS
}

export async function get(
  userID: UserID,
  refreshToken: RefreshToken,
): Promise<RefreshTokenRow | null> {
  return db
    .selectFrom(tableName)
    .selectAll()
    .where("id", "=", refreshToken.unwrap())
    .where("userID", "=", userID.unwrap())
    .executeTakeFirstOrThrow()
    .then(rowDecoder.verify)
    .catch((e) => {
      Logger.error(`#${tableName}.get error ${e}`)
      return null
    })
}

export async function getByPrevious(
  userID: UserID,
  refreshToken: RefreshToken,
): Promise<RefreshTokenRow | null> {
  return db
    .selectFrom(tableName)
    .selectAll()
    .where("previousID", "=", refreshToken.unwrap())
    .where("userID", "=", userID.unwrap())
    .executeTakeFirstOrThrow()
    .then(rowDecoder.verify)
    .catch((e) => {
      Logger.error(`#${tableName}.get error ${e}`)
      return null
    })
}

export async function remove(
  userID: UserID,
  refreshToken: RefreshToken,
): Promise<number> {
  return db
    .deleteFrom(tableName)
    .where("id", "=", refreshToken.unwrap())
    .where("userID", "=", userID.unwrap())
    .executeTakeFirst()
    .then((r) => Number(r.numDeletedRows) || 0)
    .catch((e) => {
      Logger.error(`#${tableName}.remove error ${e}`)
      throw e
    })
}

export async function removeAllByUser(userID: UserID): Promise<number> {
  return db
    .deleteFrom(tableName)
    .where("userID", "=", userID.unwrap())
    .executeTakeFirst()
    .then((r) => Number(r.numDeletedRows) || 0)
    .catch((e) => {
      Logger.error(`#${tableName}.removeAllByUser error ${e}`)
      throw e
    })
}

export async function removeAllExpired(): Promise<number> {
  const lastCreatedAt = createTimestampE(
    createNow().unwrap() - refreshTokenExpiryMS,
  )

  if (lastCreatedAt._t === "Left") {
    Logger.error(`#${tableName}.removeAllExpired error ${lastCreatedAt.error}`)
    throw new Error(lastCreatedAt.error)
  }

  return db
    .deleteFrom(tableName)
    .where("createdAt", "<=", toDate(lastCreatedAt.value))
    .executeTakeFirst()
    .then((r) => Number(r.numDeletedRows) || 0)
    .catch((e) => {
      Logger.error(`#${tableName}.removeAllExpired error ${e}`)
      throw e
    })
}

/** For testing */
export async function _createExpired(userID: UserID): Promise<RefreshToken> {
  const expiredCreatedAt = new Date(
    Date.now() - refreshTokenExpiryMS - 1000, // 1 second expired
  )
  const refreshToken = createRefreshToken()
  return db
    .insertInto(tableName)
    .values({
      id: refreshToken.unwrap(),
      previousID: refreshToken.unwrap(),
      previousCreatedAt: expiredCreatedAt,
      userID: userID.unwrap(),
      createdAt: expiredCreatedAt,
    })
    .executeTakeFirstOrThrow()
    .then(() => refreshToken)
    .catch((e) => {
      Logger.error(`#${tableName}._createExpired error ${e}`)
      throw e
    })
}

export const rowDecoder: JD.Decoder<RefreshTokenRow> = JD.object({
  id: refreshTokenDecoder,
  previousID: refreshTokenDecoder,
  previousCreatedAt: JD.date.transform(fromDate),
  userID: userIDDecoder,
  createdAt: JD.date.transform(fromDate),
})
