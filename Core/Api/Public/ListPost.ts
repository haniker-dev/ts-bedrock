import * as JD from "decoders"
import { Post, postDecoder } from "../../App/Post"
import { Api, responseDecoder } from "../../Data/Api"
import { Text256, text256Decoder } from "../../Data/Text"
import { Nat, natDecoder } from "../../Data/Number/Nat"
import { Maybe, maybeOptionalDecoder } from "../../Data/Maybe"

export type Contract = Api<
  "GET",
  "/list-post",
  UrlParams,
  NoBodyParams,
  ErrorCode,
  Payload
>

export type UrlParams = {
  page: Nat
  pageSize: Nat
  title: Maybe<Text256>
}

export type NoBodyParams = Record<string, never>
export type ErrorCode = null
export type Payload = {
  posts: Array<Post>
  total: Nat
}

export const contract: Contract = {
  method: "GET",
  route: "/list-post",
  urlDecoder: JD.object({
    page: natDecoder,
    pageSize: natDecoder,
    title: maybeOptionalDecoder(text256Decoder),
  }),
  bodyDecoder: JD.always({}),
  responseDecoder: responseDecoder(
    JD.null_,
    JD.object({
      posts: JD.array(postDecoder),
      total: natDecoder,
    }),
  ),
}
