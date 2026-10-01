import {
  sdateStringDecoder,
  fromJsDateLocal,
  toJsDateLocal,
} from "../../../../Core/Data/Time/SDate"
import { createDateOfBirth } from "../../../../Core/Data/User/DateOfBirth"

describe("Data/Time/SDate", () => {
  it("decode SDate", () => {
    const sdate = sdateStringDecoder.verify("1981-01-27")
    assert.strictEqual(sdate.toJSON(), "1981-01-27T00:00:00Z")
  })

  it("checks invalid SDate", () => {
    const invalidDate = sdateStringDecoder.decode("1981-02-31")
    assert.strictEqual(invalidDate.ok, false)
  })

  it("accepts a future SDate, which is not a DateOfBirth", () => {
    const futureDate = sdateStringDecoder.verify("3000-01-01")
    assert.strictEqual(futureDate.toJSON(), "3000-01-01T00:00:00Z")
    assert.strictEqual(createDateOfBirth(futureDate), null)
  })

  // WARN This test is dependant on test runner's timezone
  // so it may not work everywhere
  it("handles timezone by taking only local date, not UTC date", () => {
    // Assuming your test runner timezone is +8
    // sDate UTC is 1981-01-27T21:00:00 (add 1 hour)
    // sDate locally is 1981-01-28T05:00:00+08:00
    const mDate = new Date("1981-01-27T20:00:00-01:00")
    const sdate = fromJsDateLocal(mDate)
    if (sdate == null) {
      throw new Error("fromJsDateLocal returned null sdate")
    }
    assert.strictEqual(sdate.toJSON(), "1981-01-28T00:00:00Z")

    // A JsDate from SDate is always expressed as local time
    const mDate2 = toJsDateLocal(sdate)
    assert.strictEqual(mDate2.getFullYear(), 1981)
    assert.strictEqual(mDate2.getMonth() + 1, 1)
    assert.strictEqual(mDate2.getDate(), 28)
  })
})
