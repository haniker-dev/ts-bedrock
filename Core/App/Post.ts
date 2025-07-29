import * as JD from "decoders"
import { PostID, postIDDecoder } from "./PostID"
import {
  Text256,
  text256Decoder,
  TextNoLimit,
  textNoLimitDecoder,
} from "../Data/Text"
import { Comment, commentDecoder } from "./Comment"
import { PostTag, postTagDecoder } from "./PostTag"
import { Timestamp, timestampDecoder } from "../Data/Timestamp"

export type Post = {
  id: PostID
  title: Text256
  content: TextNoLimit
  comments: Array<Comment>
  tags: Array<PostTag>
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const postDecoder: JD.Decoder<Post> = JD.object({
  id: postIDDecoder,
  title: text256Decoder,
  content: textNoLimitDecoder,
  comments: JD.array(commentDecoder),
  tags: JD.array(postTagDecoder),
  createdAt: timestampDecoder,
  updatedAt: timestampDecoder,
})
