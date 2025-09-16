import { createText3E } from "../../../Core/Data/Text"
import { _fromErr } from "../../Fixture/Result"

describe("Data/Text", () => {
  it("Text too long", () => {
    const tooLong = "1234"
    const result = _fromErr(createText3E(tooLong))
    assert.strictEqual(result, "TEXT_TOO_LONG")
  })
})
