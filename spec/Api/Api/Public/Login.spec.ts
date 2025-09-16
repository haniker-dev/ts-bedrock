import { handler } from "../../../../Api/src/Api/Public/Login"
import * as AccessToken from "../../../../Api/src/App/AccessToken"
import * as RefreshTokenRow from "../../../../Api/src/Database/RefreshTokenRow"
import { emailDecoder } from "../../../../Core/Data/User/Email"
import { passwordDecoder } from "../../../../Core/App/User/Password"
import { toString } from "../../../../Core/Data/Security/JsonWebToken"
import {
  _createUser,
  _notNull,
  _fromErr,
  _fromOk,
  _hashPassword,
} from "../../../Fixture"

describe("Api/Public/Login", () => {
  test("login success", async () => {
    const email = emailDecoder.verify("user@example.com")
    const password = passwordDecoder.verify("Valid4Good.Password")
    const hashedPassword = await _hashPassword(password.unwrap())
    await _createUser(email.unwrap(), { password: hashedPassword.unwrap() })

    const { accessToken, refreshToken, user } = await handler({
      email,
      password,
    }).then(_fromOk)
    expect(user.id.unwrap()).toEqual(user.id.unwrap())
    expect(user.email.unwrap()).toEqual(email.unwrap())
    expect(accessToken).toBeDefined()
    expect(refreshToken).toBeDefined()

    const jwtPayload = await AccessToken.verify(toString(accessToken))
      .then(_fromOk)
      .then((t) => t.unwrap())
    expect(jwtPayload.userID.unwrap()).toEqual(user.id.unwrap())

    // Ensure login creates a refreshToken in database
    const refreshTokenCount = await RefreshTokenRow.removeAllByUser(user.id)
    expect(refreshTokenCount).toBe(1)
  })

  test("login error", async () => {
    const email = emailDecoder.verify("user@example.com")
    const rightPassword = passwordDecoder.verify("Valid4Good.Password")
    const wrongPassword = passwordDecoder.verify("Wrong&Password2")

    const userNotFound = await handler({ email, password: rightPassword }).then(
      _fromErr,
    )
    expect(userNotFound).toEqual("USER_NOT_FOUND")

    const hashedPassword = await _hashPassword(rightPassword.unwrap())
    await _createUser(email.unwrap(), { password: hashedPassword.unwrap() })
    const invalidPassword = await handler({
      email,
      password: wrongPassword,
    }).then(_fromErr)
    expect(invalidPassword).toEqual("INVALID_PASSWORD")
  })
})
