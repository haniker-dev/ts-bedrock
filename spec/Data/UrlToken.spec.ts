import { describe, it } from "node:test"
import assert from "node:assert"
import { createText3 } from "../../core/Data/Text"
import { toStringRecord } from "../../core/Data/UrlToken"

describe("Data/UrlToken", () => {
  it("Stringify record string properly", () => {
    const text3 = createText3("ABC")
    if (text3 == null) throw new Error("Invalid Text3")
    const data = {
      value: text3,
    }
    const result = toStringRecord(data)
    assert.deepStrictEqual(result, { value: "ABC" })
  })
})
