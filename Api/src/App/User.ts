import type { User } from "../../../Core/App/User"
import type { UserRow } from "../Database/UserRow"

export function toUser(userRow: UserRow): User {
  return {
    id: userRow.id,
    email: userRow.email,
    name: userRow.name,
  }
}
