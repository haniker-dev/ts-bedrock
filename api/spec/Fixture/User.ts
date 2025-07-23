import * as UserRow from "../../src/Database/UserRow"
import * as Hash from "../../src/Data/Hash"
import { _notNull } from "./Maybe"
import { createEmail } from "../../../core/Data/User/Email"
import { createName } from "../../../core/App/User/Name"
import { createNow } from "../../../core/Data/Timestamp"
import { createUserID } from "../../../core/App/User/UserID"
import { passwordDecoder } from "../../../core/App/User/Password"

export const _defaultPassword = passwordDecoder.verify("Valid4Good.Password")

export async function _createUser(
  emailS: string,
  userData?: Partial<UserRow.UserRow>,
): Promise<UserRow.UserRow> {
  const hashedPassword = await _hashPassword(_defaultPassword.unwrap())
  const now = createNow()

  return UserRow.unsafeCreate({
    id: createUserID(),
    email: _notNull(createEmail(emailS)),
    name: _notNull(createName("Alice")),
    password: hashedPassword.unwrap(),
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
    ...userData,
  })
}

export async function _hashPassword(s: string): Promise<Hash.Hash> {
  return Hash.issue(s).then(_notNull)
}
