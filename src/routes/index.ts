import express from "express";
import usersPostRoutes from "./users/post"
import postsGetRoutes from "./posts/get"
import postsPostRoutes from "./posts/post"

export default function (app: express.Application): void {
  usersPostRoutes(app)
  postsGetRoutes(app)
  postsPostRoutes(app)
}
