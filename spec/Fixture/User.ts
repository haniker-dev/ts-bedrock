import * as UserRow from "../../Api/src/Database/UserRow"
import * as Hash from "../../Api/src/Data/Hash"
import { _notNull } from "./Maybe"
import { createEmail } from "../../Core/Data/User/Email"
import { createName } from "../../Core/App/User/Name"
import { createNow } from "../../Core/Data/Timestamp"
import { createUserID } from "../../Core/App/User/UserID"
import { passwordDecoder } from "../../Core/App/User/Password"

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
