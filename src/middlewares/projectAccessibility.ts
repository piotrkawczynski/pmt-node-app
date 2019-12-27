import {
  Request,
  RequestBody,
  Response,
} from "../types/express/express"
import { NextFunction } from "express-serve-static-core"
import { db } from "../database"
import { Project as DbProject } from "../models/project"
import { createErrorMessage } from "../utils/utils"

export const projectAccessibility = async (
  req: RequestBody<{ projectId: number }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { projectId } = req.body

    const user = res.locals.user

    const userProjects = await db.UserProjectPermission.findOne(
      {
        where: {
          userId: user.id,
          projectId,
        },
        include: [{ model: DbProject, as: "project" }],
        attributes: {
          exclude: [
            "id",
            "projectId",
            "userId",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    )

    if (!userProjects) {
      throw Error("Unauthorized request")
    }

    res.locals.project = userProjects.project

    next()
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(403).send(createErrorMessage(error))
  }
}
