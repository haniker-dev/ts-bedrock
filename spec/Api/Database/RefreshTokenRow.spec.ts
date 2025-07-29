import * as RefreshTokenRow from "../../../Api/src/Database/RefreshTokenRow"
import { _createUser } from "../../Fixture"

describe("Database/RefreshTokenRow", () => {
  test("success", async () => {
    const user = await _createUser("user@example.com")
    const anotherUser = await _createUser("anotherUser@example.com")
    const [bad, good, other] = await Promise.all([
      RefreshTokenRow._createExpired(user.id),
      RefreshTokenRow.create(user.id),
      RefreshTokenRow.create(anotherUser.id),
    ])

    await RefreshTokenRow.removeAllExpired()

    const [bad_, good_, other_] = await Promise.all([
      RefreshTokenRow.get(user.id, bad),
      RefreshTokenRow.get(user.id, good),
      RefreshTokenRow.get(anotherUser.id, other),
    ])

    expect(bad_).toBeNull()
    expect(good.unwrap()).toBe(good_?.id.unwrap())
    expect(other.unwrap()).toBe(other_?.id.unwrap())
  })
})
