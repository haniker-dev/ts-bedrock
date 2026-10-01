import * as JD from "decoders"
import { error, resultDecoder, value } from "../../../Core/Data/Result"
import { timestampDecoder } from "../../../Core/Data/Time/Timestamp"
import { emailDecoder } from "../../../Core/Data/User/Email"

describe("Data/Result", () => {
  it("Decodes an Ok carrying a Timestamp", () => {
    const wire = { _t: "Ok", value: 1790856794401 }
    const result = resultDecoder(JD.string, timestampDecoder).verify(wire)
    assert.strictEqual(value(result)?.unwrap(), wire.value)
  })

  it("Decodes an Err carrying an Email", () => {
    const wire = { _t: "Err", error: "a@b.co" }
    const result = resultDecoder(emailDecoder, JD.string).verify(wire)
    assert.strictEqual(error(result)?.unwrap(), wire.error)
  })

  it("Decodes an Ok through a decoder that turns a string into its length", () => {
    const lengthDecoder = JD.string.transform((s) => s.length)
    const result = resultDecoder(JD.string, lengthDecoder).verify({
      _t: "Ok",
      value: "abc",
    })
    assert.strictEqual(value(result), 3)
  })
})
