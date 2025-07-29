import { createText3E } from "../../../Core/Data/Text"
import { _fromLeft } from "../../Fixture/Either"

describe("Data/Text", () => {
  it("Text too long", () => {
    const tooLong = "1234"
    const result = _fromLeft(createText3E(tooLong))
    assert.strictEqual(result, "TEXT_TOO_LONG")
  })
})
