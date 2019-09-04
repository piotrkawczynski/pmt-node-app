import {
  RequestBody,
  Response,
} from "../types/express/express"
import { db } from "../database"
import { createErrorMessage } from "../utils/utils"
import { Transaction } from "sequelize"
import { CreateCommentBody } from "../types/request/comment/createComment"

export const createComment = async (
  req: RequestBody<CreateCommentBody>,
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

    const createdComment = await db.Comment.create(
      { ...fields },
      { transaction },
    )

    await createdComment.setAttachments(attachments, {
      transaction,
    })

    await transaction.commit()
    res.status(200).send(createdComment)
  } catch (error) {
    // tslint:disable-next-line:no-console
    await transaction.rollback()
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}
