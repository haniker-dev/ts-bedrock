import { User } from "../../../core/App/User"
import { UserRow } from "../Database/UserRow"

export function toUser(userRow: UserRow): User {
  return {
    id: userRow.id,
    email: userRow.email,
    name: userRow.name,
  }
}
