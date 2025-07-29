import { createPassword } from "../../../../Core/App/User/Password"

describe("Data/User/Password", () => {
  it("valid password", () => {
    ;[
      "a@345678",
      "//00123123",
      "a@345⚠️78", // Emoji is considered a symbol based on our regex
      "1@#$%^&*()-=[];'/><.",
      ">>2a<<//",
      "Easy2Type&Safe",
    ].forEach((p) => {
      const pp = createPassword(p)
      if (pp == null) throw new Error(`${p} is invalid password`)
      assert.strictEqual(pp.unwrap(), p)
    })
  })

  it("invalid password", () => {
    ;[
      "",
      " ",
      "1234567",
      "12345678",
      "a2345678",
      "a 345678",
      "@@##$%%**",
    ].forEach((p) => {
      const pp = createPassword(p)
      assert.strictEqual(pp, null)
    })
  })
})
