import { db } from "../database"
import {
  createErrorMessage,
  createUrl,
} from "../utils/utils"
import { CreateTagFields } from "../types/request/tag/createTag"
import { CreateTagResponse } from "../types/response/tag/createTag"
import { DeleteTag } from "../types/request/tag/deleteTag"
import {
  Request,
  RequestBody,
  RequestParams,
  Response,
} from "../types/express/express"
import { NextFunction } from "express-serve-static-core"
import { ProjectIdLocals } from "../types/locals/projectIdLocals"
import { projectCompletion } from "../middlewares/checkProjectCompletion"

export const createTag = async (
  req: RequestBody<CreateTagFields>,
  res: Response,
) => {
  try {
    const fields = req.body
    const image = req.file as Express.Multer.File

    const tag = await db.Tag.create({
      ...fields,
      image: image.filename,
    })

    if (!tag) {
      throw Error("Something went wrong")
    }

    const createdTag = {
      id: tag.id,
      name: tag.name,
      image: createUrl(req, tag.image),
    } as CreateTagResponse

    await projectCompletion(tag.projectId)

    res.status(200).send(createdTag)
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}

export const deleteTag = async (
  req: RequestParams<DeleteTag>,
  res: Response<ProjectIdLocals>,
  next: NextFunction,
) => {
  try {
    const { id } = req.params

    const tag = await db.Tag.findOne({
      where: { id },
    })

    res.locals.projectId = tag.projectId

    await tag.destroy()

    next()
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}
