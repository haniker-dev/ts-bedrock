import {
  sdateStringDecoder,
  fromJsDateLocal,
  toJsDateLocal,
} from "../../../../Core/Data/Time/SDate"

describe("Data/Time/SDate", () => {
  it("decode SDate", () => {
    const dob = sdateStringDecoder.verify("1981-01-27")
    assert.strictEqual(dob.toJSON(), "1981-01-27T00:00:00Z")
  })

  it("checks invalid SDate", () => {
    const invalidDate = sdateStringDecoder.decode("1981-02-31")
    assert.strictEqual(invalidDate.ok, false)

    const futureDate = sdateStringDecoder.decode("3000-01-01")
    assert.strictEqual(futureDate.ok, false)
  })

  // WARN This test is dependant on test runner's timezone
  // so it may not work everywhere
  it("handles timezone by taking only local date, not UTC date", () => {
    // Assuming your test runner timezone is +8
    // sDate UTC is 1981-01-27T21:00:00 (add 1 hour)
    // sDate locally is 1981-01-28T05:00:00+08:00
    const mDate = new Date("1981-01-27T20:00:00-01:00")
    const dob = fromJsDateLocal(mDate)
    if (dob == null) {
      throw new Error("fromJsDateLocal returned null dob")
    }
    assert.strictEqual(dob.toJSON(), "1981-01-28T00:00:00Z")

    // A JsDate from Dob is always expressed as local time
    const mDate2 = toJsDateLocal(dob)
    assert.strictEqual(mDate2.getFullYear(), 1981)
    assert.strictEqual(mDate2.getMonth() + 1, 1)
    assert.strictEqual(mDate2.getDate(), 28)
  })
})
