import jwt from "jsonwebtoken"

export default async function (username: string): Promise<void> {
  const payload = { username: username }
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      "secret_key",
      {
        expiresIn: 60 * 30
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token)
      }
    )
  })
}
