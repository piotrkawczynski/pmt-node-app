import { db } from "../database"
import { Response } from "express"
import { createErrorMessage } from "../utils/utils"

const getPermissionsList = async (req, res: Response) => {
  try {
    const permissions = await db.Permission.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    })

    res.status(200).send(permissions)
  } catch (error) {
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}

export { getPermissionsList }
