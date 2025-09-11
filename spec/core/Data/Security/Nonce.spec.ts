import * as JD from "decoders"
import { createHash } from "crypto"
import {
  createNonce,
  Nonce,
  nonceDecoder,
  payloadNonce,
  verifyNonce,
} from "../../../../Core/Data/Security/Nonce"
import { createNow } from "../../../../Core/Data/Time/Timestamp"
import {
  PositiveInt100,
  positiveIntDecoder,
} from "../../../../Core/Data/Number/PositiveInt"
import { text256Decoder } from "../../../../Core/Data/Text"

const secretKey = "Test-Secret-Key"
const hashFn = (nonce: string) =>
  Promise.resolve(
    text256Decoder.verify(
      createHash("sha256").update(nonce).digest().toString("hex"),
    ),
  )

// Complicated payload to ensure nonce JSON stringify is correct
const payload = {
  primitive: "hello world",
  nested: { opaque: PositiveInt100 },
}
const payloadDecoder: JD.Decoder<typeof payload> = JD.object({
  primitive: JD.string,
  nested: JD.object({ opaque: positiveIntDecoder }),
})

describe("Data/Security/Nonce", () => {
  it("Can verify Nonce successfully", async () => {
    // CLIENT: Let's pretend we have a nonce created from frontend
    const clientNonce: Nonce<typeof payload> = await createNonce({
      secretKey,
      requestedAt: createNow(),
      payload,
      hashFn,
    })

    // SERVER: Let's pretend we are decoding the received nonce JSON on server
    const clientNonceJSON = JSON.parse(JSON.stringify(clientNonce))
    const receivedNonceOnServer =
      nonceDecoder(payloadDecoder).verify(clientNonceJSON)
    const isNonceValid = await verifyNonce(
      receivedNonceOnServer,
      secretKey,
      hashFn,
    )
    assert.strictEqual(isNonceValid, true)

    const receivedPayload = payloadNonce(receivedNonceOnServer)
    assert.strictEqual(receivedPayload.primitive, payload.primitive)
    assert.strictEqual(
      receivedPayload.nested.opaque.unwrap(),
      payload.nested.opaque.unwrap(),
    )
  })

  it("Generate different nonceHash with different payload", async () => {
    const sameRequestedAt = createNow()
    const nonce1 = await createNonce({
      secretKey,
      requestedAt: sameRequestedAt,
      payload,
      hashFn,
    })
    const nonce2 = await createNonce({
      secretKey,
      requestedAt: sameRequestedAt,
      payload: { ...payload, primitive: "different" },
      hashFn,
    })

    assert.notStrictEqual(
      nonce1.unwrap().nonceHash.unwrap(),
      nonce2.unwrap().nonceHash.unwrap(),
    )
  })
})
