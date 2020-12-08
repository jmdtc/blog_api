import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { User } from "../../database/models/user";
import createJwt from "../../jwt/createJwt";

interface UserLogins {
  username: string;
  password: string;
}

export default function (app: express.Application): void {
  app.post("/users", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password }: UserLogins = req.body
      await User.create({
        username: username,
        password: await bcrypt.hash(password, 10)
      })

      res.status(201).json({
        message: "created",
        token: await createJwt(username)
      })
    } catch (err) {
      if (
        err.errors && //signature of a sequelize error
        err.original.errno === 19
      ) {
        return res.status(409).json({
          message: "conflict"
        })
      }
      next(err)
    }
  })

  app.post("/users/auth", async (req: Request, res: Response, next: NextFunction) => {
    const { username, password }: UserLogins = req.body
    if (!username || !password) {
      return res.status(400).json({
        message: "some fields are missing, expects a username and a password"
      })
    }
    try {
      const user = await User.findOne({where:{username: username}})
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({
          message: "authentication failed"
        })
      }
      return res.status(200).json({
        message: "ok",
        token: await createJwt(username)
      });
    } catch (err) {
      next(err)
    }
  })
}
