import * as API from "../../../../Core/Api/Public/RefreshToken"
import { Result, err, ok } from "../../../../Core/Data/Result"
import * as RefreshTokenRow from "../../Database/RefreshTokenRow"
import * as AccessToken from "../../App/AccessToken"
import * as UserRow from "../../Database/UserRow"
import { toUser } from "../../App/User"
import { UserID } from "../../../../Core/App/User/UserID"
import { RefreshToken } from "../../../../Core/Data/Security/RefreshToken"

export const contract = API.contract

/** It is VERY IMPORTANT to ensure that user has received the new RefreshToken
 * or provide a way for user to recover
 * We have chosen to allow user to reuse previous token
 * to get the new refreshToken
 * */
export async function handler(
  params: API.BodyParams,
): Promise<Result<API.ErrorCode, API.Payload>> {
  const { userID, refreshToken } = params
  const token = await RefreshTokenRow.get(userID, refreshToken)
  if (token == null) {
    // User may have missed out the new refresh token
    // Let's try if we can find their previous refresh token
    return handleByPreviousRefreshToken(params)
  }

  if (RefreshTokenRow.isExpired(token)) {
    return err("INVALID")
  }

  const newRefreshToken = await RefreshTokenRow.replace(token)
  return issueJWTandRefreshToken(userID, newRefreshToken.id)
}

/** When a user failed to receive the new refresh token previously
 * due to maybe network error or app crashes
 * the user will refresh again with an old token
 * When this happens, we will simply return the already issued refreshToken.
 *
 * WARN This creates a weaker security
 * as we allow previous refresh token to be used again
 * Pros: No need user to acknowledge the new refresh token
 * Cons: Previous token can be reused to get issued refresh token
 *       though only the last token can be reused
 *
 * NOTE We chose to return the same refreshToken instead of generating a new one
 */
async function handleByPreviousRefreshToken(
  params: API.BodyParams,
): Promise<Result<API.ErrorCode, API.Payload>> {
  const { userID, refreshToken } = params
  const token = await RefreshTokenRow.getByPrevious(userID, refreshToken)
  if (token == null || RefreshTokenRow.isExpiredPrevious(token)) {
    return err("INVALID")
  }

  return issueJWTandRefreshToken(userID, token.id)
}

async function issueJWTandRefreshToken(
  userID: UserID,
  refreshToken: RefreshToken,
): Promise<Result<API.ErrorCode, API.Payload>> {
  const userRow = await UserRow.getByID(userID)
  if (userRow == null) {
    return err("INVALID")
  }

  const accessToken = await AccessToken.issue(userRow.id)

  return ok({
    user: toUser(userRow),
    accessToken,
    refreshToken,
  })
}
