import {
  RequestBody,
  Response,
} from "../types/express/express"
import { db } from "../database"
import { createErrorMessage } from "../utils/utils"
import { CreateIssueBody } from "../types/request/issue/createIssue"
import { Transaction } from "sequelize"

export const createIssue = async (
  req: RequestBody<CreateIssueBody>,
  res: Response,
) => {
  let transaction: Transaction

  try {
    transaction = await db.sequelize.transaction()

    const fields = req.body
    const images = req.files as Express.Multer.File[]

    const imageToCreate = images.map((image) => {
      return { image: image.filename }
    })

    const attachments = await db.Attachment.bulkCreate(
      imageToCreate,
      { transaction },
    )

    const createdIssue = await db.Issue.create(
      { ...fields },
      { transaction },
    )

    await createdIssue.setAttachments(attachments, {
      transaction,
    })

    await transaction.commit()
    res.status(200).send(createdIssue)
  } catch (error) {
    // tslint:disable-next-line:no-console
    await transaction.rollback()
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}
