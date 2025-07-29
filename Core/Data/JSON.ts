import { Either, left, right } from "./Either"

/** When streaming JSON, multiple different JSON values can be read at once
 * We delimit each JSON value using this **/
export const JSONStreamDelimiter = "\0"

export function parseJSON(s: string): Either<string, unknown> {
  try {
    const data = JSON.parse(s)
    return right(data)
  } catch (error) {
    return left(String(error))
  }
}
