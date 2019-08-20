import { db } from "../database"
import { createErrorMessage } from "../utils/utils"
import { CreateTagFields } from "../types/request/createTag"

export const createTag = async (req, res) => {
  try {
    const fields = req.body as CreateTagFields
    const image = req.file as Express.Multer.File

    const tag = await db.Tag.create({
      ...fields,
      image: image.filename,
    })

    if (!tag) {
      throw Error("Something went wrong")
    }

    res.status(200).send()
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}
