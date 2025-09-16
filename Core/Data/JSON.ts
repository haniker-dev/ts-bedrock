import { Result, err, ok } from "./Result"

/** When streaming JSON, multiple different JSON values can be read at once
 * We delimit each JSON value using this **/
export const JSONStreamDelimiter = "\0"

export function parseJSON(s: string): Result<string, unknown> {
  try {
    const data = JSON.parse(s)
    return ok(data)
  } catch (error) {
    return err(String(error))
  }
}
