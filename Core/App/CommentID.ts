import { Opaque, jsonValueCreate } from "../Data/Opaque"
import * as JD from "decoders"
import { Either, left, right } from "../Data/Either"

const key: unique symbol = Symbol()

export type CommentID = Opaque<number, typeof key>
export type ErrorCommentID = "INVALID_COMMENT_ID"

export function createCommentIDE(n: number): Either<ErrorCommentID, CommentID> {
  if (Number.isInteger(n) === false || n < 0) {
    return left("INVALID_COMMENT_ID")
  }
  return right(jsonValueCreate<number, typeof key>(key)(n))
}

export function createCommentID(n: number): CommentID | null {
  const result = createCommentIDE(n)
  return result._t === "Right" ? result.value : null
}

export const commentIDDecoder: JD.Decoder<CommentID> = JD.number.transform(
  (n) => {
    const result = createCommentIDE(n)
    if (result._t === "Left") {
      throw new Error(`Invalid CommentID: ${n}`)
    }
    return result.value
  },
)
