import { Comment } from "../../../Core/App/Comment"
import { CommentRow } from "../Database/CommentRow"

export function toComment(commentRow: CommentRow): Comment {
  return {
    id: commentRow.id,
    postID: commentRow.postID,
    userID: commentRow.userID,
    content: commentRow.content,
    createdAt: commentRow.createdAt,
  }
}
