import { count, create } from "../../src/Database/UserRow"
import * as Hash from "../../src/Data/Hash"
import * as Logger from "../../src/Logger"
import { emailDecoder } from "../../../Core/Data/User/Email"
import { nameDecoder } from "../../../Core/App/User/Name"

type NewUserData = {
  nameStr: string
  emailStr: string
}

export async function seedProd(): Promise<void> {
  return _seedUsers([{ nameStr: "Alice", emailStr: "alice@example.com" }])
}

export async function seedDev(): Promise<void> {
  return _seedUsers([{ nameStr: "Alice", emailStr: "alice@example.com" }])
}

async function _seedUsers(newUserData: NewUserData[]): Promise<void> {
  const password = "Qwe1234#"
  const hashedPassword = await Hash.issue(password)
  if (hashedPassword == null) {
    throw new Error(`_seedUsers: Failed to hash password`)
  }

  const newUserCount = await count()
  if (newUserCount.unwrap() > 0) {
    Logger.log(`Skipping seeding users.`)
  } else {
    for (const { nameStr, emailStr } of newUserData) {
      await create({
        email: emailDecoder.verify(emailStr),
        name: nameDecoder.verify(nameStr),
        hashedPassword,
      })

      Logger.log(`Seeded user ${emailStr}`)
    }
  }
}
