import * as JD from "decoders"
import { Name, nameDecoder } from "./User/Name"
import { UserID, userIDDecoder } from "./User/UserID"
import { Email, emailDecoder } from "../Data/User/Email"

/** Provided as an example for App-level Type 1
 * User type differs from app to app
 * so it cannot belong to Data context-folder
 */
export type User = {
  id: UserID
  name: Name
  email: Email
}

export const userDecoder: JD.Decoder<User> = JD.object({
  id: userIDDecoder,
  name: nameDecoder,
  email: emailDecoder,
})
