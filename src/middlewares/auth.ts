import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

export interface AuthInfoRequest extends Request {
  username: string;
}

export default function (req: AuthInfoRequest, res: Response, next: NextFunction) {
  const authHeader = req.get("authorization")
  if (!authHeader) return res.status(401).json({ message: "Authentication required"})
  try {
    const token = authHeader.split(" ")[1]
    jwt.verify(token, "secret_key", (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.username = user.username;
      next();
    });
  }
  catch {
    res.status(401).json({ message: "Auth Error" })
  }
}
