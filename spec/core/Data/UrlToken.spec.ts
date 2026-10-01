import { createText3 } from "../../../Core/Data/Text"
import { serializeUrlRecord } from "../../../Core/Data/UrlToken"

describe("Data/UrlToken", () => {
  it("Stringify record string properly", () => {
    const text3 = createText3("ABC")
    if (text3 == null) throw new Error("Invalid Text3")
    const data = {
      value: text3,
    }
    const result = serializeUrlRecord(data)
    assert.deepStrictEqual(result, { value: "ABC" })
  })

  it("Stringify string, number, boolean and bigint", () => {
    const result = serializeUrlRecord({
      string: "a b",
      number: 1.5,
      boolean: false,
      bigint: 10n,
    })
    assert.deepStrictEqual(result, {
      string: "a b",
      number: "1.5",
      boolean: "false",
      bigint: "10",
    })
  })

  it("Stringify NaN and Infinity by name", () => {
    const result = serializeUrlRecord({ nan: NaN, infinity: Infinity })
    assert.deepStrictEqual(result, { nan: "NaN", infinity: "Infinity" })
  })

  it("Stringify null, undefined, function and symbol as empty string", () => {
    const result = serializeUrlRecord({
      null: null,
      undefined: undefined,
      function: () => "a",
      symbol: Symbol("a"),
    })
    assert.deepStrictEqual(result, {
      null: "",
      undefined: "",
      function: "",
      symbol: "",
    })
  })

  it("Keeps a quote inside an opaque string", () => {
    const text3 = createText3('a"b')
    if (text3 == null) throw new Error("Invalid Text3")
    const result = serializeUrlRecord({ value: text3 })
    assert.deepStrictEqual(result, { value: 'a"b' })
  })

  it("Keeps an array as an array and stringifies each element", () => {
    const text3 = createText3("ABC")
    if (text3 == null) throw new Error("Invalid Text3")
    const result = serializeUrlRecord({
      values: ["a,b", 1, true, 10n, null, text3],
    })
    assert.deepStrictEqual(result, {
      values: ["a,b", "1", "true", "10", "", "ABC"],
    })
  })

  it("Stringify an object or an array inside an array as empty string", () => {
    const result = serializeUrlRecord({ values: [{ a: 1 }, ["a"], "b"] })
    assert.deepStrictEqual(result, { values: ["", "", "b"] })
  })

  it("Stringify a plain object as empty string", () => {
    const result = serializeUrlRecord({
      object: { a: 1 },
      nested: { a: { b: 10n } },
    })
    assert.deepStrictEqual(result, { object: "", nested: "" })
  })

  it("Stringify an object with toJSON as the value its toJSON returns", () => {
    const result = serializeUrlRecord({
      date: new Date(0),
      number: { toJSON: () => 1 },
      bigint: { toJSON: () => 10n },
    })
    assert.deepStrictEqual(result, {
      date: "1970-01-01T00:00:00.000Z",
      number: "1",
      bigint: "10",
    })
  })

  it("Stringify an object as empty string when its toJSON returns an object, null or undefined", () => {
    const result = serializeUrlRecord({
      object: { toJSON: () => ({ a: 1 }) },
      array: { toJSON: () => ["a"] },
      null: { toJSON: () => null },
      undefined: { toJSON: () => undefined },
    })
    assert.deepStrictEqual(result, {
      object: "",
      array: "",
      null: "",
      undefined: "",
    })
  })
})
