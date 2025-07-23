import { describe, it } from "node:test"
import assert from "node:assert"
import { createText3E } from "../../core/Data/Text"
import { _fromLeft } from "../Either"

describe("Data/Text", () => {
  it("Text too long", () => {
    const tooLong = "1234"
    const result = _fromLeft(createText3E(tooLong))
    assert.strictEqual(result, "TEXT_TOO_LONG")
  })
})
