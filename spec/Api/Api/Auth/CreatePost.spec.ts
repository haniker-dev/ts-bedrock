import { handler } from "../../../../Api/src/Api/Auth/CreatePost"
import { text256Decoder, textNoLimitDecoder } from "../../../../Core/Data/Text"
import {
  _createUser,
  _createTag,
  _hashPassword,
  _fromRight,
} from "../../../Fixture"

describe("Api/Auth/CreatePost", () => {
  test("create post success", async () => {
    const user = await _createUser("user@example.com")

    const title = text256Decoder.verify("Test Post Title")
    const content = textNoLimitDecoder.verify(
      "This is the content of the test post.",
    )
    const [tag1, tag2] = await Promise.all([
      _createTag("tag1"),
      _createTag("tag2"),
    ])

    const result = await handler(user, {
      title,
      content,
      tags: [tag1, tag2],
    }).then(_fromRight)

    expect(result.title.unwrap()).toEqual(title.unwrap())
    expect(result.content.unwrap()).toEqual(content.unwrap())
    expect(result.tags.length).toBe(2)
    expect(result.tags.map((t) => t.name.unwrap())).toEqual([
      tag1.name.unwrap(),
      tag2.name.unwrap(),
    ])
    expect(result.id.unwrap()).toBeDefined()
  })
})
