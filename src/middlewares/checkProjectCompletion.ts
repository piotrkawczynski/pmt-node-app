import { Request, Response } from "../types/express/express"
import { db } from "../database"
import { UserLocals } from "../types/locals/userLocals"
import { ProjectIdLocals } from "../types/locals/projectIdLocals"

export const checkProjectCompletion = async (
  req: Request,
  res: Response<ProjectIdLocals & UserLocals>,
) => {
  try {
    const { projectId } = res.locals

    const project = await db.Project.findOne({
      where: { id: projectId },
    })

    const statusCount = await db.Status.count({
      where: { projectId },
    })

    if (!statusCount) {
      if (project.completed) {
        await project.update({ completed: 0 })
      }

      return res.status(200).send()
    }

    const tagCount = await db.Tag.count({
      where: { projectId },
    })

    if (!tagCount) {
      if (project.completed) {
        await project.update({ completed: 0 })
      }

      return res.status(200).send()
    }

    await project.update({ completed: 1 })

    return res.status(200).send()
  } catch (error) {
    console.log(error)
    res.status(400).send(error.message)
  }
}

export const projectCompletion = async (
  projectId: number,
) => {
  try {
    const project = await db.Project.findOne({
      where: { id: projectId },
    })

    const statusCount = await db.Status.count({
      where: { projectId },
    })

    if (!statusCount) {
      if (project.completed) {
        await project.update({ completed: 0 })
      }
    }

    const tagCount = await db.Tag.count({
      where: { projectId },
    })

    if (!tagCount) {
      if (project.completed) {
        await project.update({ completed: 0 })
      }
    }

    await project.update({ completed: 1 })
  } catch (error) {
    console.log(error)
  }
}
