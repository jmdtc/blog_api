import {
  Sequelize,
} from "sequelize";
import bcrypt from "bcrypt"
import { initUser, User } from "./models/user"
import { initPost, Post } from "./models/post"

const generateRandomString = function (): string {
  return Math.random().toString(36).replace(/[^a-z]+/g, '')
}

export default async function(): Promise<void> {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.db"
  })

  const inits = [initUser, initPost]
  await Promise.all(inits.map(initFunc => initFunc(sequelize)))

  await User.hasMany(Post, {
    sourceKey: "id",
    foreignKey: "author_id",
    as: "posts",
  })

  // after this line we are just populating the db
  // with random data
  const firstUser = await User.create({
    username: "Johnny",
    password: await bcrypt.hash("test_password", 10)
  })

  await Promise.all(
    [...Array(12)].map(el => firstUser.createPost({
      body: generateRandomString(),
      title: generateRandomString(),
    }))
  )
}
