import { db } from "../database"
import { Request, Response } from "../types/express/express"
import { NextFunction } from "express-serve-static-core"

export const getUserByToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

      console.log("authorization", authorization)

      if (!user) {
        return res
          .status(403)
          .send({ error: "Unauthorized request" })
      }

      res.locals.user = user
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
