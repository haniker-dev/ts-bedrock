import * as JD from "decoders"
import type { JsonWebToken } from "../../Data/Security/JsonWebToken"
import { jsonWebTokenDecoder } from "../../Data/Security/JsonWebToken"
import type { UserID } from "./UserID"
import { userIDDecoder } from "./UserID"

export type JwtPayload = { userID: UserID }

export type AccessToken = JsonWebToken<JwtPayload>

export const jwtPayloadDecoder: JD.Decoder<JwtPayload> = JD.object({
  userID: userIDDecoder,
})

export const accessTokenDecoder: JD.Decoder<AccessToken> =
  jsonWebTokenDecoder(jwtPayloadDecoder)
