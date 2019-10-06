import {
  Request,
  RequestBody,
  Response,
} from "../types/express/express"
import { db } from "../database"
import {
  createErrorMessage,
  createImageUrl,
} from "../utils/utils"
import { CreateIssueBody } from "../types/request/issue/createIssue"
import { Transaction } from "sequelize"
import { UserLocals } from "../types/locals/userLocals"
import { UpdateIssueBody } from "../types/request/issue/updateIssue"
import { UpdateIssueStatus } from "../types/request/issue/updateIssueStatus"
import { UpdateIssueSprint } from "../types/request/issue/updateIssueSprint"

export const createIssue = async (
  req: RequestBody<CreateIssueBody>,
  res: Response<UserLocals>,
) => {
  let transaction: Transaction

  try {
    transaction = await db.sequelize.transaction()

    const fields = req.body
    const images = req.files as Express.Multer.File[]
    const user = res.locals.user

    const imageToCreate = images.map((image) => {
      return { image: image.filename }
    })

    const lastIssue = await db.Issue.findOne({
      where: { sprintId: fields.sprintId },
      order: [["id", "DESC"]],
    })

    let code = 1

    if (lastIssue) {
      code = lastIssue.code + 1
    }

    const attachments = await db.Attachment.bulkCreate(
      imageToCreate,
      { transaction },
    )

    const createdIssue = await db.Issue.create(
      { ...fields, code, authorId: user.id },
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

export const updateIssue = async (
  req: RequestBody<UpdateIssueBody>,
  res: Response<UserLocals>,
) => {
  let transaction: Transaction

  try {
    transaction = await db.sequelize.transaction()

    const fields = req.body
    const issueId = fields.id
    const uploadedAttachments = req.files as Express.Multer.File[]

    if (!issueId) {
      await transaction.rollback()
      return res.status(404).send()
    }

    const issue = await db.Issue.findOne({
      where: { id: issueId },
    })

    if (!issue) {
      await transaction.rollback()
      return res.status(404).send()
    }

    const attachments = await issue.getAttachments()

    console.log("attachments", attachments)

    const attachmentIdsToDelete = attachments
      .filter(
        (attachment) =>
          !fields.attachmentUrls.includes(
            createImageUrl(req, attachment.image),
          ),
      )
      .map(({ id }) => id)

    console.log(
      "attachmentIdsToDelete",
      attachmentIdsToDelete,
    )

    if (!!attachmentIdsToDelete.length) {
      await db.Attachment.destroy({
        where: { id: attachmentIdsToDelete },
        transaction,
      })
    }

    let createdAttachments

    if (!!uploadedAttachments.length) {
      const attachmentsToCreate = uploadedAttachments.map(
        ({ filename }) => {
          return { image: filename }
        },
      )

      createdAttachments = await db.Attachment.bulkCreate(
        attachmentsToCreate,
        { transaction },
      )
    }

    delete fields.attachmentUrls

    const updatedIssue = await db.Issue.update(
      { ...fields },
      {
        where: { id: issueId },
        transaction,
        returning: true,
      },
    )

    if (createdAttachments) {
      await updatedIssue[1][0].addAttachments(
        createdAttachments,
        {
          transaction,
        },
      )
    }

    await transaction.commit()

    res.status(200).send()
  } catch (error) {
    // tslint:disable-next-line:no-console
    await transaction.rollback()
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}

export const getIssue = async (
  req: Request,
  res: Response<UserLocals>,
) => {
  try {
    const issueId = req.params.id
    const user = res.locals.user

    if (!issueId) {
      return res.status(404).send()
    }

    const issue = await db.Issue.findOne({
      where: { id: issueId },
    })

    if (!issue) {
      return res.status(404).send()
    }

    const userProject = await db.UserProjectPermission.findOne(
      {
        where: {
          projectId: issue.projectId,
          userId: user.id,
        },
      },
    )

    if (!userProject) {
      return res.status(403).send("Unauthorized request")
    }

    const attachmentEntities = await issue.getAttachments()
    const attachments = attachmentEntities.map(
      ({ image }) => createImageUrl(req, image),
    )

    res.status(200).send({ ...issue.get(), attachments })
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}

export const updateIssueStatus = async (
  req: RequestBody<UpdateIssueStatus>,
  res: Response<UserLocals>,
) => {
  try {
    const issueId = req.params.id
    const { statusId } = req.body

    const updatedIssue = await db.Issue.update(
      { statusId },
      { where: { id: issueId } },
    )

    res.status(200).send(updatedIssue)
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}

export const updateIssueSprint = async (
  req: Request<{ id: string }, UpdateIssueSprint>,
  res: Response<UserLocals>,
) => {
  try {
    const issueId = req.params.id
    const { sprintId } = req.body

    const updatedIssue = await db.Issue.update(
      { sprintId },
      { where: { id: issueId } },
    )

    res.status(200).send(updatedIssue)
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}
