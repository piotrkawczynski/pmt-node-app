import {
  RequestBody,
  Response,
  Request,
  RequestParams,
} from "../types/express/express"
import { db } from "../database"
import {
  createErrorMessage,
  createImageUrl,
} from "../utils/utils"
import { Transaction } from "sequelize"
import { CreateCommentBody } from "../types/request/comment/createComment"
import { UserLocals } from "../types/locals/userLocals"

export const createComment = async (
  req: RequestBody<CreateCommentBody>,
  res: Response<UserLocals>,
) => {
  let transaction: Transaction

  try {
    transaction = await db.sequelize.transaction()

    const fields = req.body
    const attachmentsFiles = req.files as Express.Multer.File[]

    const userId = res.locals.user.id

    const attachmentsToCreate = attachmentsFiles.map(
      (image) => {
        return { image: image.filename }
      },
    )

    const attachments = await db.Attachment.bulkCreate(
      attachmentsToCreate,
      { transaction },
    )

    const createdComment = await db.Comment.create(
      { ...fields, authorId: userId, permissionId: 1 },
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

export const getCommentList = async (
  req: Request<{ id: string }>,
  res: Response<UserLocals>,
) => {
  let transaction: Transaction

  try {
    transaction = await db.sequelize.transaction()

    const issueId = req.params.id

    const comments = await db.Comment.findAll({
      where: { issueId },
      transaction,
    })

    const commentsWithAttachments = await Promise.all(
      comments.map(async (comment) => {
        const attachmentsEntities = await comment.getAttachments()

        const attachments = attachmentsEntities.map(
          ({ image }) => createImageUrl(req, image),
        )

        return {
          ...comment.get(),
          attachments,
        }
      }),
    )

    console.log(
      "commentsWithAttachments",
      commentsWithAttachments,
    )

    await transaction.commit()
    res.status(200).send(commentsWithAttachments)
  } catch (error) {
    // tslint:disable-next-line:no-console
    await transaction.rollback()
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}

export const deleteComment = async (
  req: RequestParams<{ id: string }>,
  res: Response<UserLocals>,
) => {
  try {
    const commentId = req.params.id
    const userId = res.locals.user.id

    const comment = await db.Comment.findOne({
      where: { id: commentId, authorId: userId },
    })

    if (comment) {
      await comment.destroy()

      return res.status(200).send()
    }

    res.status(404).send("Not found")
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}
