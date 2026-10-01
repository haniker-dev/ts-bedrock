import * as AccessToken from "../../../Api/src/App/AccessToken"
import { createUserID } from "../../../Core/App/User/UserID"
import {
  expiringWithin,
  getExpiry,
} from "../../../Core/Data/Security/JsonWebToken"
import {
  addMillisecond,
  afterNow,
  createNow,
} from "../../../Core/Data/Time/Timestamp"
import { fromHour, fromMinute } from "../../../Core/Data/Time/Millisecond"
import { Hour1 } from "../../../Core/Data/Time/Hour"
import { Minute15 } from "../../../Core/Data/Time/Minute"

describe("Api/App/AccessToken", () => {
  test("an issued token expires within an hour and not within 15 minutes", async () => {
    const accessToken = await AccessToken.issue(createUserID())
    const expiry = getExpiry(accessToken)
    const anHourFromNow = addMillisecond(createNow(), fromHour(Hour1))

    expect(afterNow(expiry)).toBe(true)
    expect(expiry.unwrap()).toBeLessThanOrEqual(anHourFromNow.unwrap())
    expect(expiringWithin(fromMinute(Minute15), accessToken)).toBe(false)
  })
})
