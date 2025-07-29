import * as API from "../../../../Core/Api/Auth/CreatePost"
import { Either, right } from "../../../../Core/Data/Either"
import { AuthUser } from "../AuthApi"
import * as PostRow from "../../Database/PostRow"
import * as PostTagRow from "../../Database/PostTagRow"
import { toPost } from "../../App/Post"

export const contract = API.contract

export async function handler(
  _user: AuthUser,
  params: API.BodyParams,
): Promise<Either<API.ErrorCode, API.Payload>> {
  const { title, content, tags } = params

  // Create the post
  const createdPostRow = await PostRow.create({ title, content })

  // Create tags for the post
  await Promise.all(
    tags.map((tag) =>
      PostTagRow.create({ postID: createdPostRow.id, tagName: tag.name }),
    ),
  )

  return right(toPost(createdPostRow, [], tags))
}
