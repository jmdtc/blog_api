import express, { Request, Response, NextFunction } from "express";
import auth, { AuthInfoRequest } from "../../middlewares/auth"
import { User } from "../../database/models/user"

interface PostAttributes {
  body: string;
  title: string;
}

export default function (app: express.Application): void {
  app.post("/posts", auth, async (req: AuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      const { username } = req
      const { body, title }: PostAttributes = req.body
      const user = await User.findOne({where: {username: username}})
      if (!body || !title) {
        return res.status(400).json({
          message: "some fields are missing"
        })
      }

      const newPost = await user.createPost({body: body, title: title})
      res.status(201).json({
        message: "created",
        post: newPost
      })
    } catch (err) {
      next(err)
    }
  })
}
