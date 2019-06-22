import {
  Request,
  Response,
  NextFunction,
} from "express-serve-static-core"
import { db } from "../database"

export const getUserByToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.method !== "OPTIONS") {
      const authorization = req.headers
        .authorization as string

      console.log(authorization)
      console.log(req.headers)

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

      req[`user`] = user
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
