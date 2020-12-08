import express, { Request, Response, NextFunction } from "express";
import { Post } from "../../database/models/post";

interface RequestLimit {
  limit?: number;
}

interface RequestID {
  id?: string;
}


export default function (app: express.Application): void {
  app.get("/posts", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit }: RequestLimit = req.query
      const posts = await Post.findAll({
        limit: limit ? Number(limit) : 10,
        order: [['created_at', 'DESC']]
      })

      return res.status(200).json({
        message: "ok",
        posts: posts
      })
    } catch (err) {
      next(err)
    }
  })

  app.get("/posts/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id }: RequestID = req.params
      const post = await Post.findOne({where: {id: id}})
      if (post === null) {
        return res.status(404).json({
          message: "not found"
        })
      }
      return res.status(200).json({
        message: "ok",
        post: post
      })
    } catch (err) {
      next(err)
    }
  })
}
