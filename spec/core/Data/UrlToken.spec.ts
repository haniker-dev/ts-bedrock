import { createText3 } from "../../../Core/Data/Text"
import { toStringRecord } from "../../../Core/Data/UrlToken"

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
