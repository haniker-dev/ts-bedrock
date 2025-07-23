import * as JD from "decoders"
import {
  JsonWebToken,
  jsonWebTokenDecoder,
} from "../../Data/Security/JsonWebToken"
import { UserID, userIDDecoder } from "./UserID"

export type JwtPayload = { userID: UserID }

export type AccessToken = JsonWebToken<JwtPayload>

export const jwtPayloadDecoder: JD.Decoder<JwtPayload> = JD.object({
  userID: userIDDecoder,
})

export const accessTokenDecoder: JD.Decoder<AccessToken> =
  jsonWebTokenDecoder(jwtPayloadDecoder)
