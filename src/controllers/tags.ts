import { User } from "../models/user"
import { db } from "../database"
import { createErrorMessage } from "../utils/utils"

export const createTag = async (req, res) => {
  try {
    const user = req.user as User

    console.log(req.body)

    const tag = await db.Tag.create({ ...req.body })

    console.log(tag.get({ plain: true }))

    // if (!userProjects) {
    //   throw Error("No projects found")
    // }
    //
    // const projects = JSON.parse(
    //   JSON.stringify(userProjects),
    // ).map((userProject) => {
    //   return {
    //     ...userProject.project,
    //     permissionId: userProject.permissionId,
    //     image: createImageUrl(
    //       req,
    //       userProject.project.image,
    //     ),
    //   }
    // }) as IProject

    res.status(200).send({ data: "" })
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}
