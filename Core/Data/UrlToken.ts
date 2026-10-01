// type T = Tokens<"/x/:x/y/:y?z=:z">
export type Tokens<T extends string> = UrlTokens<T> | QueryTokens<T>

// Url only provides string-based values (even for number)
// hence, we treat it as unknown so that we can decode it into other types
export type UrlRecord<R extends string> = Record<Tokens<R>, unknown>

// Adapted from https://www.uplift.ltd/posts/validating-routes-with-typescript/
// type T = UrlTokens<"/:a/x/:b/y/:c">
export type UrlTokens<T extends string> = T extends `${infer Url}?${infer _}`
  ? UrlTokens<Url>
  : T extends
        | `${infer _}/:${infer Token}/${infer Rest}`
        | `:${infer Token}/${infer Rest}`
    ? Token | UrlTokens<Rest>
    : T extends
          | `${infer _}/:${infer Token}`
          | `:${infer Token}/`
          | `:${infer Token}`
      ? Token
      : never

// type T = QueryTokens<"/?x=:x&y?=:y&z=:z&a[]=:a&a[]=:a">
export type QueryTokens<T> = T extends `${infer _}?${infer Query}`
  ? SplitQueryTokens<Query>
  : never

type SplitQueryTokens<T extends string> =
  T extends `${infer Token}&${infer Rest}`
    ? ExtractQueryToken<Token> | SplitQueryTokens<Rest>
    : T extends `${infer Token}`
      ? ExtractQueryToken<Token>
      : never

type ExtractQueryToken<T extends string> =
  T extends `${infer Token}?=:${infer _}`
    ? RemoveBracket<Token>
    : T extends `${infer Token}=:${infer _}`
      ? RemoveBracket<Token>
      : never

type RemoveBracket<T> = T extends `${infer Token}[]` ? Token : T

export function serializeUrlRecord<R extends string>(
  urlData: UrlRecord<R>,
): Record<string, string | string[]> {
  return Object.fromEntries(
    Object.entries(urlData).map(([key, value]) => [key, serializeValue(value)]),
  )
}

function serializeValue(value: unknown): string | string[] {
  return Array.isArray(value)
    ? value.map(serializeScalar)
    : serializeScalar(value)
}

function serializeScalar(value: unknown): string {
  switch (typeof value) {
    case "string":
      return value
    case "number":
    case "bigint":
    case "boolean":
      return String(value)
    case "undefined":
    case "function":
    case "symbol":
      return ""
    case "object":
      return value == null ? "" : serializeViaToJSON(value)
  }
}

function serializeViaToJSON(value: object): string {
  const serialized: unknown = JSON.parse(
    JSON.stringify(value, (_key, toJSONApplied: unknown) =>
      typeof toJSONApplied === "object" ? "" : serializeScalar(toJSONApplied),
    ),
  )
  return typeof serialized === "string" ? serialized : ""
}
