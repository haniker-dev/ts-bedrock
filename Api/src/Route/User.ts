import { Express } from "express"
import { publicApi } from "../Api/PublicApi"
import * as Login from "../Api/Public/Login"
import * as Logout from "../Api/Auth/Logout"
import * as Profile from "../Api/Auth/Profile"
import * as UpdateProfile from "../Api/Auth/UpdateProfile"
import * as RefreshToken from "../Api/Public/RefreshToken"
import { authApi } from "../Api/AuthApi"

export function userRoutes(app: Express): void {
  publicApi(app, Login)
  publicApi(app, RefreshToken)
  authApi(app, Logout)
  authApi(app, Profile)
  authApi(app, UpdateProfile)
}
