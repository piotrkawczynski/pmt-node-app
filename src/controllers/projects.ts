import { db } from "../database"
import { User } from "../models/user"
import { Project } from "../models/project"
import { Attachment } from "../models/attachment"
import {
  createErrorMessage,
  createImageUrl,
  updateObjectWithUrl,
} from "../utils/utils"
import { Status } from "../models/status"
import { Tag } from "../models/tag"

const getUserProjects = async (req, res) => {
  try {
    const user = req.user as User

    const userProjects = await db.UserProjectPermission.findAll(
      {
        where: {
          userId: user.id,
        },
        include: [{ model: Project, as: "project" }],
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

    const projects = JSON.parse(
      JSON.stringify(userProjects),
    ).map((userProject) => {
      return {
        ...userProject.project,
        permissionId: userProject.permissionId,
        image: createImageUrl(
          req,
          userProject.project.image,
        ),
      }
    })

    res.status(200).send({ data: projects })
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
            model: Project,
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

    const project = JSON.parse(
      JSON.stringify(userProject.get("project")),
    )

    if (project.image) {
      project.image = createImageUrl(req, project.image)
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

const tags = async (req, res) => {
  try {
    const { body, user } = req

    console.log("body", body)

    const transactionResult = await createProjectTransaction(
      body,
    )

    console.log("transactionResult", transactionResult)

    res.status(200).send({ data: "" })
  } catch (error) {
    console.log(error)
    res.status(400).send(createErrorMessage(error))
  }
}

const createProjectTransaction = async (data) => {
  const transaction = await db.sequelize.transaction()

  try {
    const project = await db.Project.create(data.project, {
      transaction,
    })

    const createdTags = await db.Tag.bulkCreate(data.tags, {
      transaction,
    })

    await project.setTags(createdTags, {
      transaction,
    })

    const createdStatuses = await db.Status.bulkCreate(
      data.statuses,
      {
        transaction,
      },
    )

    await project.setStatuses(createdStatuses, {
      transaction,
    })

    console.log("tags", tagsL)

    // TODO: adding users to invite table to be able to send email with invitation
    // await db.User.bulkCreate(data.users, { transaction })

    await transaction.commit()
  } catch (error) {
    transaction.rollback()
    console.log("error", error)
  }
}

export {
  getUserProjects,
  getProject,
  getProjectStatuses,
  getProjectTags,
  getProjectUsers,
  tags,
}
