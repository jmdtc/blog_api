import express, { Request, Response, NextFunction } from "express";
import {
  Sequelize,
} from "sequelize";
import setupDB from "./database/setupDB"
import routes from "./routes/index"
import errorHandler from "./middlewares/errorHandler";

const app: express.Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

setupDB().then(() => {
  console.log("DB ready")

  app.use(express.json());

  app.get("/", (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send("Blog_api responding");
    } catch (err) {
      next(err)
    }
  });

  routes(app);

  app.use(errorHandler(app.get("env")));
  app.listen(PORT, () => {
    return console.log(`server is listening on ${PORT}`);
  });
})
