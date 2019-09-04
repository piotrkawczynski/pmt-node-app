import { db } from "../database"
import { createErrorMessage } from "../utils/utils"
import { CreateStatusBody } from "../types/request/status/createStatus"
import { CreateStatusResponse } from "../types/response/status/createStatusResponse"
import { UpdateStatusOrderBody } from "../types/request/status/updateStatusOrder"
import { DeleteStatus } from "../types/request/status/deleteStatus"
import { Op, Sequelize, Transaction } from "sequelize"
import {
  Request,
  RequestParams,
  Response,
} from "../types/express/express"
import { NextFunction } from "express-serve-static-core"
import { ProjectIdLocals } from "../types/locals/projectIdLocals"
import { projectCompletion } from "../middlewares/checkProjectCompletion"

export const createStatus = async (
  req: Request,
  res: Response,
) => {
  try {
    const body = req.body as CreateStatusBody

    const status = await db.Status.create(body)

    if (!status) {
      throw Error("Something went wrong")
    }

    const response: CreateStatusResponse = {
      id: status.id,
      name: status.name,
      order: status.order,
    }

    await projectCompletion(status.projectId)

    res.status(200).send(response)
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}

export const updateStatusOrder = async (
  req: Request,
  res: Response,
) => {
  try {
    const body = req.body as UpdateStatusOrderBody

    const { firstStatus, secondStatus } = body

    await db.Status.update(
      { name: firstStatus.name },
      { where: { id: firstStatus.id } },
    )

    await db.Status.update(
      { name: secondStatus.name },
      { where: { id: secondStatus.id } },
    )

    res.status(200).send()
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}

export const deleteStatus = async (
  req: RequestParams<DeleteStatus>,
  res: Response<ProjectIdLocals>,
  next: NextFunction,
) => {
  let transaction: Transaction

  try {
    transaction = await db.sequelize.transaction()
    const { id } = req.params

    const statusToDelete = await db.Status.findOne({
      where: { id },
      transaction,
    })
    const projectId = statusToDelete.projectId
    const statusToDeleteOrder = statusToDelete.order
    await statusToDelete.destroy({ transaction })

    await db.Status.increment("order", {
      by: -1,
      where: {
        projectId,
        [Op.and]: [
          { projectId },
          { order: { [Op.gt]: statusToDeleteOrder } },
        ],
      },
      transaction,
    })

    res.locals.projectId = projectId

    await transaction.commit()
    next()
  } catch (error) {
    // tslint:disable-next-line:no-console
    await transaction.rollback()
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}
