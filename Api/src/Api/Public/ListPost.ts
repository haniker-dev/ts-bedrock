import * as API from "../../../../Core/Api/Public/ListPost"
import { Either, right } from "../../../../Core/Data/Either"
import { toPost } from "../../App/Post"
import * as PostRow from "../../Database/PostRow"

export const contract = API.contract

export async function handler(
  params: API.UrlParams,
): Promise<Either<API.ErrorCode, API.Payload>> {
  const { page, pageSize, title } = params

  const postsRows = await PostRow.listPosts(page, pageSize, title)
  const total = await PostRow.countPosts(title)

  return right({
    posts: postsRows.map((postRow) => toPost(postRow, [], [])),
    total,
  })
}
