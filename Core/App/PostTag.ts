import * as JD from "decoders"
import { Text256, text256Decoder } from "../Data/Text"
import { Maybe, maybeDecoder } from "../Data/Maybe"
import { Timestamp, timestampDecoder } from "../Data/Timestamp"
import { TagName, tagNameDecoder } from "./TagName"

export type PostTag = {
  name: TagName
  description: Maybe<Text256>
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const postTagDecoder: JD.Decoder<PostTag> = JD.object({
  name: tagNameDecoder,
  description: maybeDecoder(text256Decoder),
  createdAt: timestampDecoder,
  updatedAt: timestampDecoder,
})
