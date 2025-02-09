import { db } from "../database"
import {
  RequestBody,
  RequestParams,
  Response,
  Request,
} from "../types/express/express"
import { NextFunction } from "express-serve-static-core"
import { UserLocals } from "../types/locals/userLocals"
import { createErrorMessage } from "../utils/utils"
import { Common } from "../types/request/common"

export const checkProjectAccess = async (
  req: Request,
  res: Response<UserLocals>,
  next: NextFunction,
) => {
  try {
    const { user } = res.locals

    const projectId = req.params.id
    const userId = user.id

    const userProject = await db.UserProjectPermission.findOne(
      {
        where: {
          projectId,
          userId,
        },
      },
    )

    if (!userProject) {
      throw Error("Unauthorised request")
    }

    next()
  } catch (error) {
    console.log(error)
    res.status(400).send(createErrorMessage(error))
  }
}
