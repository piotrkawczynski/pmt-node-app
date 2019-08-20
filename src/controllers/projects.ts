import { db } from "../database"
import { User } from "../models/user"
import { Attachment } from "../models/attachment"
import {
  createErrorMessage,
  createImageUrl,
  updateObjectWithUrl,
} from "../utils/utils"
import { Status } from "../models/status"
import { Tag } from "../models/tag"
import { CreateProjectFields } from "../types/request/createProject"
import { Project } from "../types/models/Project"
import { Project as DbProject } from "../models/project"
import { Request } from "../types/express/express"

const getUserProjects = async (req: Request, res) => {
  try {
    const user = req.user

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

const getProject = async (req, res) => {
  try {
    const { params, user } = req

    const projectId = params.id
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

const getProjectStatuses = async (req, res) => {
  try {
    const { params, user } = req

    const projectId = params.id
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

    const statuses = await db.Status.findAll({
      where: {
        projectId,
      },
      attributes: {
        exclude: ["projectId"],
      },
      include: [{ model: Attachment }],
    })

    if (!statuses) {
      throw Error("No statuses found")
    }

    const updatedStatuses = statuses.map((status) => {
      return updateObjectWithUrl<Status>(req, status)
    })

    res.status(200).send({ data: updatedStatuses })
  } catch (error) {
    console.log(error)
    res.status(400).send(createErrorMessage(error))
  }
}

const getProjectTags = async (req, res) => {
  try {
    const { params, user } = req

    const projectId = params.id
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

    const tags = await db.Tag.findAll({
      where: {
        projectId,
      },
      attributes: {
        exclude: ["projectId"],
      },
      include: [{ model: Attachment }],
    })

    if (!tags) {
      throw Error("No tags found")
    }

    const updatedTags = tags.map((tag) => {
      return updateObjectWithUrl<Tag>(req, tag)
    })

    res.status(200).send({ data: updatedTags })
  } catch (error) {
    console.log(error)
    res.status(400).send(createErrorMessage(error))
  }
}

const getProjectUsers = async (req, res) => {
  try {
    const { params, user } = req

    const projectId = params.id
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

    const users = usersProjectPermission.map(
      (row) => row.user,
    )

    res.status(200).send({ data: users })
  } catch (error) {
    console.log(error)
    res.status(400).send(createErrorMessage(error))
  }
}

const createProject = async (req, res) => {
  try {
    const fields = req.body as CreateProjectFields
    const avatar = req.file as Express.Multer.File

    const project: Project = {
      ...fields,
      sprintDuration: Number(fields.sprintDuration),
      avatar: avatar.filename,
    }
    console.log(req.body)
    console.log(req.file)

    const createdProject = await db.Project.create(project)

    const userProject = await db.UserProjectPermission.create(
      {
        projectId: createdProject.id,
        userId: req.user.id,
        permissionId: 2,
      },
    )
    console.log("projectData", userProject)

    res.status(200).send()
  } catch (error) {
    console.log(error)
    res.status(400).send(createErrorMessage(error))
  }
}

const createProjectTransaction = async (data) => {
  const transaction = await db.sequelize.transaction()

  try {
    console.log(data)

    const project = await db.Project.create(data.project, {
      transaction,
    })

    console.log(project)

    // const createdTags = await db.Tag.bulkCreate(data.tags, {
    //   transaction,
    // })
    // await project.setTags(createdTags, {
    //   transaction,
    // })
    //
    // const createdStatuses = await db.Status.bulkCreate(
    //   data.statuses,
    //   {
    //     transaction,
    //   },
    // )
    // await project.setStatuses(createdStatuses, {
    //   transaction,
    // })
    //
    // const createdInvites = await db.Invite.bulkCreate(
    //   data.users,
    //   { transaction },
    // )
    // await project.setInvites(createdInvites, {
    //   transaction,
    // })

    await transaction.commit()
  } catch (error) {
    transaction.rollback()
    console.log("error", error)
    throw Error(error.message)
  }
}

export {
  getUserProjects,
  getProject,
  getProjectStatuses,
  getProjectTags,
  getProjectUsers,
  createProject,
}
