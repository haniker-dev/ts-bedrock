import * as Teki from "../../../Web/node_modules/teki"
import { serializeUrlRecord } from "../../../Core/Data/UrlToken"

describe("Web/Api path", () => {
  it("Joins an array with commas on a query token", () => {
    const path = toPath("/items?ids=:ids", { ids: ["a", "b"] })
    assert.strictEqual(path, "/items?ids=a%2Cb")
  })

  it("Joins an array with commas on a path token", () => {
    const path = toPath("/items/:ids", { ids: ["a", "b"] })
    assert.strictEqual(path, "/items/a,b")
  })

  it("Cannot tell a comma inside an element from the separator", () => {
    const path = toPath("/items?ids=:ids", { ids: ["a,b", "c"] })
    assert.strictEqual(
      path,
      toPath("/items?ids=:ids", { ids: ["a", "b", "c"] }),
    )
  })

  it("Leaves the param empty for an empty array", () => {
    const path = toPath("/items?ids=:ids", { ids: [] })
    assert.strictEqual(path, "/items?ids=")
  })

  it("Parses the joined param back as one string", () => {
    const path = toPath("/items?ids=:ids", { ids: ["a", "b"] })
    const params = Teki.parse("/items?ids=:ids")("http://localhost" + path)
    assert.deepStrictEqual(params, { ids: "a,b" })
  })
})

function toPath(route: string, urlData: Record<string, unknown>): string {
  return Teki.reverse(route)(serializeUrlRecord(urlData))
}
