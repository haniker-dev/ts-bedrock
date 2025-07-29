import { Post } from "../../../Core/App/Post"
import { CommentRow } from "../Database/CommentRow"
import { PostRow } from "../Database/PostRow"
import { TagRow } from "../Database/TagRow"
import { toComment } from "./Comment"

export function toPost(
  postRow: PostRow,
  comments: Array<CommentRow>,
  tags: Array<TagRow>,
): Post {
  return {
    id: postRow.id,
    title: postRow.title,
    content: postRow.content,
    comments: comments.map(toComment),
    tags,
    createdAt: postRow.createdAt,
    updatedAt: postRow.updatedAt,
  }
}
