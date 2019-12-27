import { db } from "../database"
import { createErrorMessage } from "../utils/utils"
import { CreateInviteBody } from "../types/request/invite/createInvite"
import { CreateInviteResponse } from "../types/response/invite/createInviteResponse"
import {
  Request,
  RequestParams,
  Response,
} from "../types/express/express"
import { DeleteTag } from "../types/request/tag/deleteTag"
import { ProjectIdLocals } from "../types/locals/projectIdLocals"
import { NextFunction } from "express-serve-static-core"
import { UserLocals } from "../types/locals/userLocals"
import { Common } from "../types/request/common"
import { UserProjectPermission } from "../models/userProjectPermission"

export const createInvite = async (
  req: Request,
  res: Response,
) => {
  try {
    const body = req.body as CreateInviteBody

    const user = await db.User.findOne({
      where: { email: body.email },
    })

    if (user) {
      await db.UserProjectPermission.create({
        projectId: body.projectId,
        permissionId: body.permissionId,
        userId: user.id,
      })
    }

    const invite = await db.Invite.create(body)

    if (!invite) {
      throw Error("Something went wrong")
    }

    const response: CreateInviteResponse = {
      id: invite.id,
      email: invite.email,
      permissionId: invite.permissionId,
    }

    res.status(200).send(response)
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}

export const deleteInvite = async (
  req: RequestParams<{
    id: string
  }>,
  res: Response<UserLocals>,
) => {
  try {
    const { id } = req.params
    const { user } = res.locals

    const invite = await db.Invite.findOne({
      where: { id },
    })

    const userProjectPermission = await db.UserProjectPermission.findOne(
      {
        where: {
          projectId: invite.projectId,
          userId: user.id,
        },
      },
    )

    if (!userProjectPermission) {
      res.status(403).send({ error: "Unauthorized user" })
    }

    const foundUser = await db.User.findOne({
      where: { email: invite.email },
    })

    await db.UserProjectPermission.destroy({
      where: {
        userId: foundUser.id,
        projectId: invite.projectId,
        permissionId: invite.permissionId,
      },
    })

    await db.Invite.destroy({
      where: { id },
    })

    res.status(200).send()
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}
