import { db } from "../database"
import { createErrorMessage } from "../utils/utils"
import {
  Request,
  RequestBody,
  RequestParams,
  Response,
} from "../types/express/express"
import { CreateSprintBody } from "../types/request/sprints/CreateSprintBody"
import { UserLocals } from "../types/locals/userLocals"
import { Project as DbProject } from "../models/project"
import { pick } from "lodash"
import { UpdateSprintBody } from "../types/request/sprints/UpdateSprintBody"
import { Op } from "sequelize"
import { Issue } from "../models/issue"
import { Sprint } from "../models/sprint"
import { Common } from "../types/request/common"

const createSprint = async (
  req: RequestBody<CreateSprintBody>,
  res: Response,
) => {
  try {
    const body = req.body

    const lastSprint = await db.Sprint.findOne({
      limit: 1,
      order: [["number", "DESC"]],
    })

    const sprint = await db.Sprint.create({
      ...body,
      number: lastSprint ? lastSprint.number + 1 : 1,
    })

    if (!sprint) {
      throw Error("Something went wrong")
    }

    res.status(200).send(sprint)
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}

const updateSprint = async (
  req: Request<
    {
      id: string
      name: string
    },
    UpdateSprintBody
  >,
  res: Response<UserLocals>,
) => {
  try {
    const { body } = req
    const sprintValues = pick(body, [
      "description",
      "dateFrom",
      "dateTo",
    ])
    const sprintId = req.params.id
    const user = res.locals.user

    const sprint = await db.Sprint.findOne({
      where: { id: sprintId },
    })

    if (!sprint) {
      return res.status(404).send({ error: "Not found" })
    }

    const userProject = await db.UserProjectPermission.findOne(
      {
        where: {
          projectId: sprint.projectId,
          userId: user.id,
        },
      },
    )

    if (!userProject) {
      return res
        .status(403)
        .send({ error: "Unauthorized request" })
    }

    const updatedSprint = await sprint.update({
      ...sprintValues,
    })

    if (!updatedSprint) {
      throw Error("Something went wrong")
    }

    res.status(200).send(updatedSprint)
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}

const deleteSprint = async (
  req: RequestParams<{
    id: string
  }>,
  res: Response<UserLocals>,
) => {
  try {
    const sprintId = req.params.id
    const user = res.locals.user

    const sprint = await db.Sprint.findOne({
      where: { id: sprintId },
    })

    if (!sprint) {
      return res.status(404).send({ error: "Not found" })
    }

    const userProject = await db.UserProjectPermission.findOne(
      {
        where: {
          projectId: sprint.projectId,
          userId: user.id,
        },
      },
    )

    if (!userProject) {
      return res
        .status(403)
        .send({ error: "Unauthorized request" })
    }

    const isLatestSprint = await db.Sprint.findOne({
      where: {
        number: {
          [Op.gt]: sprint.number,
        },
      },
    })

    if (!!isLatestSprint) {
      return res
        .status(422)
        .send({ error: "Sprint is not last in project" })
    }

    await sprint.destroy()

    res.status(200).send()
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}

const getIssueList = async (
  req: Request<
    {
      id: string
    },
    any,
    { lastSprint: boolean; projectId: number }
  >,
  res: Response<UserLocals>,
) => {
  try {
    const sprintId = req.params.id
    const user = res.locals.user
    const lastSprint = req.query.lastSprint
    const projectId = req.query.projectId

    if (!projectId) {
      return res
        .status(422)
        .send({ error: "No projectId in request" })
    }

    const userProject = await db.UserProjectPermission.findOne(
      {
        where: {
          projectId,
          userId: user.id,
        },
      },
    )

    if (!userProject) {
      return res
        .status(403)
        .send({ error: "Unauthorized request" })
    }

    let issues

    if (lastSprint && projectId) {
      const sprint = await db.Sprint.findOne({
        where: { projectId },
        order: [["number", "DESC"]],
      })

      issues = await sprint.getIssues()
      issues = await issues.sort((a, b) => {
        return a.order > b.order
      })
    } else {
      issues = await db.Issue.findAll({
        where: {
          sprintId,
        },
        order: [["order", "ASC"]],
      })
    }

    if (!issues) {
      return res.status(404).send({ error: "Not found" })
    }

    res.status(200).send(issues)
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}

export {
  createSprint,
  updateSprint,
  deleteSprint,
  getIssueList,
}
