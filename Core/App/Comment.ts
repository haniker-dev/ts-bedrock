import * as JD from "decoders"
import { CommentID, commentIDDecoder } from "./CommentID"
import { PostID, postIDDecoder } from "./PostID"
import { UserID, userIDDecoder } from "./User/UserID"
import { Text1024, text1024Decoder } from "../Data/Text"
import { Timestamp, timestampDecoder } from "../Data/Timestamp"

export type Comment = {
  id: CommentID
  postID: PostID
  userID: UserID
  content: Text1024
  createdAt: Timestamp
}

export const commentDecoder: JD.Decoder<Comment> = JD.object({
  id: commentIDDecoder,
  postID: postIDDecoder,
  userID: userIDDecoder,
  content: text1024Decoder,
  createdAt: timestampDecoder,
})
