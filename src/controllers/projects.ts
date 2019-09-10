import { db } from "../database"
import { User } from "../models/user"
import {
  createErrorMessage,
  createImageUrl,
} from "../utils/utils"
import { CreateProjectFields } from "../types/request/project/createProject"
import { Project } from "../types/models/project"
import { Project as DbProject } from "../models/project"
import {
  Request,
  RequestParams,
  Response,
} from "../types/express/express"
import { UserLocals } from "../types/locals/userLocals"
import { ProjectLocals } from "../types/locals/projectLocals"
import { Common } from "../types/request/common"

const getUserProjects = async (
  req: Request<{ id: string }>,
  res: Response<UserLocals>,
) => {
  try {
    const { user } = res.locals

    const userProjects = await db.UserProjectPermission.findAll(
      {
        where: {
          userId: user.id,
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
      throw Error("No projects found")
    }

    const projects = userProjects.map((userProject) => {
      return {
        ...userProject.project.get(),
        permissionId: userProject.permissionId,
        avatar: createImageUrl(
          req,
          userProject.project.avatar,
        ),
      }
    })

    res.status(200).send(projects)
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}

const getProject = async (
  req: RequestParams<{
  id: string
}>,
  res: Response,
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
        include: [
          {
            model: DbProject,
            as: "project",
          },
        ],
        attributes: {
          exclude: [
            "id",
            "projectId",
            "userId",
            "permissionId",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    )

    if (!userProject) {
      throw Error("No project found")
    }

    const project = userProject.get("project")

    if (project.avatar) {
      project.avatar = createImageUrl(req, project.avatar)
    }
    res.status(200).send(project)
  } catch (error) {
    console.log(error)
    res.status(400).send(createErrorMessage(error))
  }
}

const getProjectStatuses = async (
  req: Request<{
  id: string
}>,
  res: Response,
) => {
  try {
    const projectId = req.params.id

    const statuses = await db.Status.findAll({
      where: {
        projectId,
      },
      attributes: {
        exclude: ["projectId"],
      },
    })

    res.status(200).send(statuses)
  } catch (error) {
    console.log(error)
    res.status(400).send(createErrorMessage(error))
  }
}

const getProjectTags = async (
  req: RequestParams<{
  id: string
}>,
  res: Response,
) => {
  try {
    const projectId = req.params.id

    const tags = await db.Tag.findAll({
      where: {
        projectId,
      },
      attributes: {
        exclude: ["projectId"],
      },
    })

    const updatedTags = tags.map((tag) => {
      return {
        ...tag.get(),
        image: createImageUrl(req, tag.image),
      }
    })

    res.status(200).send(updatedTags)
  } catch (error) {
    console.log(error)
    res.status(400).send(createErrorMessage(error))
  }
}

const getProjectUsers = async (
  req: Request<{
  id: string
}>,
  res: Response<UserLocals>,
) => {
  try {
    const projectId = req.params.id

    const usersProjectPermission = await db.UserProjectPermission.findAll(
      {
        where: {
          projectId,
        },
        include: [
          {
            model: User,
            attributes: {
              exclude: [
                "token",
                "password",
                "createdAt",
                "updatedAt",
              ],
            },
          },
        ],
      },
    )

    const users = usersProjectPermission.map((row) => ({
      ...row.user.get(),
      permission: row.permissionId,
    }))

    res.status(200).send(users)
  } catch (error) {
    console.log(error)
    res.status(400).send(createErrorMessage(error))
  }
}

const getProjectInvites = async (
  req: RequestParams<{
  id: string
}>,
  res: Response<UserLocals>,
) => {
  try {
    const projectId = req.params.id

    const inviteList = await db.Invite.findAll({
      where: {
        projectId,
      },
      attributes: {
        exclude: ["projectId"],
      },
    })

    res.status(200).send(inviteList)
  } catch (error) {
    console.log(error)
    res.status(400).send(createErrorMessage(error))
  }
}

const getProjectSprints = async (
  req: Request<{
  id: string
}>,
  res: Response<UserLocals>,
) => {
  try {
    const projectId = req.params.id

    const sprintList = await db.Sprint.findAll({
      where: {
        projectId,
      },
      attributes: {
        exclude: ["projectId", "createdAt", "updatedAt"],
      },
    })

    res.status(200).send(sprintList)
  } catch (error) {
    console.log(error)
    res.status(400).send(createErrorMessage(error))
  }
}

const createProject = async (req: Request, res) => {
  try {
    const fields = req.body as CreateProjectFields
    const avatar = req.file as Express.Multer.File

    const project: Project = {
      ...fields,
      sprintDuration: Number(fields.sprintDuration),
      avatar: avatar.filename,
    }

    const createdProject = await db.Project.create(project)

    await db.UserProjectPermission.create({
      projectId: createdProject.id,
      userId: res.locals.user.id,
      permissionId: 2,
    })

    res.status(200).send()
  } catch (error) {
    console.log(error)
    res.status(400).send(createErrorMessage(error))
  }
}

export {
  getUserProjects,
  getProject,
  getProjectStatuses,
  getProjectTags,
  getProjectUsers,
  getProjectInvites,
  createProject,
  getProjectSprints,
}
