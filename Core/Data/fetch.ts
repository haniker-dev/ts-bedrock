import { JSONStreamDelimiter, parseJSON } from "./JSON"

export async function* readFetchBodyStream(
  stream: ReadableStreamDefaultReader<Uint8Array>,
): AsyncGenerator<unknown, null, unknown> {
  // fatal: false = don't throw if error
  const decoder = new TextDecoder("utf-8", { fatal: false })
  while (true) {
    const { done, value } = await stream.read()
    if (done) {
      return null
    } else {
      const fullValue = decoder.decode(value, { stream: true }) || ""

      // A very stupid way of parsing streaming JSON object
      if (fullValue.endsWith(JSONStreamDelimiter)) {
        const values = fullValue.split(JSONStreamDelimiter)
        for (const v of values) {
          if (v.length > 0) {
            const valueM = parseJSON(v)
            if (valueM._t === "Ok") {
              yield valueM.value
            } else {
              console.error(`Invalid fragment: ${v}`)
            }
          }
        }
      }
    }
  }
}
