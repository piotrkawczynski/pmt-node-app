import { Request } from "../types/express/express"
import {
  NextFunction,
  Response,
} from "express-serve-static-core"
import { db } from "../database"
import { Project as DbProject } from "../models/project"
import { createErrorMessage } from "../utils/utils"
import { Project } from "../types/models/project"

export const projectAccessibility = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { projectId } = req.body

    const user = req.user

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

    req.project = {
      ...userProjects.project.get(),
    } as Project

    next()
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(403).send(createErrorMessage(error))
  }
}
