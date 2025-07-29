import { Express } from "express"
import { authApi } from "../Api/AuthApi"
import * as CreatePost from "../Api/Auth/CreatePost"

export function postRoutes(app: Express): void {
  authApi(app, CreatePost.contract, CreatePost.handler)
}
