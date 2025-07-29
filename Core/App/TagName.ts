import * as JD from "decoders"
import { Opaque, jsonValueCreate } from "../Data/Opaque"
import { Either, left, right } from "../Data/Either"

const key: unique symbol = Symbol()
export type TagName = Opaque<string, typeof key>
export type ErrorTagName = "EMPTY_TAG" | "TAG_TOO_LONG"

export function createTagNameE(s: string): Either<ErrorTagName, TagName> {
  if (s.length === 0) {
    return left("EMPTY_TAG")
  }
  if (s.length > 100) {
    return left("TAG_TOO_LONG")
  }
  return right(jsonValueCreate<string, typeof key>(key)(s))
}

export function createTagName(s: string): TagName | null {
  const result = createTagNameE(s)
  return result._t === "Right" ? result.value : null
}

export const tagNameDecoder: JD.Decoder<TagName> = JD.string.transform((s) => {
  const result = createTagNameE(s)
  if (result._t === "Left") {
    throw new Error(result.error)
  } else {
    return result.value
  }
})
