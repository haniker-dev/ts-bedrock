import { Express } from "express"
import { authApi } from "../Api/AuthApi"
import { publicApi } from "../Api/PublicApi"
import * as CreatePost from "../Api/Auth/CreatePost"
import * as ListPost from "../Api/Public/ListPost"

export function postRoutes(app: Express): void {
  authApi(app, CreatePost.contract, CreatePost.handler)
  publicApi(app, ListPost.contract, ListPost.handler)
}
