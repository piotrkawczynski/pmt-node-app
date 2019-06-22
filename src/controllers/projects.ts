import { omit } from "lodash"
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
import { create } from "domain"

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

    // console.log(JSON.parse(JSON.stringify(userProjects)))
    console.log(projects)

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

    if (!project.attachment) {
      project.image = null
    } else {
      project.image = createImageUrl(
        req,
        project.attachment.name,
      )
    }
    res.status(200).send(omit(project, "attachment"))
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
    console.log()
    console.log(statuses)
    console.log()

    const updatedStatuses = statuses.map((status) => {
      return updateObjectWithUrl<Status>(req, status)
    })

    console.log(updatedStatuses)

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

export {
  getUserProjects,
  getProject,
  getProjectStatuses,
  getProjectTags,
}
