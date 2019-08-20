import { db } from "../database"
import { User } from "../models/user"

export const getUserByToken = async (req, res, next) => {
  try {
    if (req.method !== "OPTIONS") {
      const authorization = req.headers
        .authorization as string

      if (!authorization) {
        return res
          .status(403)
          .send({ error: "Unauthorized request" })
      }

      const user = await db.User.findOne({
        where: { token: authorization.split(" ")[1] },
      })

      if (!user) {
        return res
          .status(403)
          .send({ error: "Unauthorized request" })
      }

      req[`user`] = user as User
    }
    next()
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    return res
      .status(403)
      .send({ error: "Unauthorized request" })
  }
}
