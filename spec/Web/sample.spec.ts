// Write a sample test case using Vitest
import { describe, it, expect } from "vitest"
import { emailDecoder } from "../../Core/Data/User/Email"
import { _fromRight } from "../Fixture/Either"

describe("Sample test", () => {
  it("should pass", () => {
    const email = emailDecoder.verify("hello@example.com")
    expect(email.unwrap()).toBe("hello@example.com")
    expect(1 + 1).toBe(2)
  })
})
