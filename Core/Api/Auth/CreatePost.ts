import * as JD from "decoders"
import { AuthApi, authResponseDecoder } from "../../Data/Api/Auth"
import { NoUrlParams, noUrlParamsDecoder } from "../../Data/Api"
import {
  Text256,
  text256Decoder,
  TextNoLimit,
  textNoLimitDecoder,
} from "../../Data/Text"
import { Post, postDecoder } from "../../App/Post"
import { PostTag, postTagDecoder } from "../../App/PostTag"

export type Contract = AuthApi<
  "POST",
  "/create-post",
  NoUrlParams,
  BodyParams,
  ErrorCode,
  Payload
>

export type BodyParams = {
  title: Text256
  content: TextNoLimit
  tags: Array<PostTag>
}

export type ErrorCode = null
export type Payload = Post

export const contract: Contract = {
  method: "POST",
  route: "/create-post",
  urlDecoder: noUrlParamsDecoder,
  bodyDecoder: JD.object({
    title: text256Decoder,
    content: textNoLimitDecoder,
    tags: JD.array(postTagDecoder),
  }),
  responseDecoder: authResponseDecoder(JD.null_, postDecoder),
}
