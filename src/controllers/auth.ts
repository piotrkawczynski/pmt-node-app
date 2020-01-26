import * as bcrypt from "bcrypt"
import * as base64url from "base64-url"
import { omit } from "lodash"

import { db } from "../database"
import {
  createMailToken,
  createToken,
} from "../utils/token"
import { createErrorMessage } from "../utils/utils"
import { Response } from "express"
import {
  Request,
  RequestBody,
} from "../types/express/express"
import { RemainPasswordBody } from "../types/request/auth/remainPasswordBody"
import { ChangePasswordBody } from "../types/request/auth/changePasswordBody"
import { Mailer } from "../utils/mailer"

const register = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword } = req.body

    const user = await db.User.findOne({ where: { email } })

    if (user) {
      throw Error("User exists in database")
    }

    if (password.length < 8) {
      throw {
        name: "password",
        message: "Password should be longer than 8 chars",
      }
    }
    if (password !== confirmPassword) {
      throw {
        name: "password",
        message: "Passwords are inconsistent",
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const token = await createToken(email)

    const userValues = {
      ...req.body,
      password: hashedPassword,
      token,
    }

    const invites = await db.Invite.findAll({
      where: {
        email,
      },
    })

    const createdUser = await db.User.create(
      omit(userValues, ["confirmPassword"]),
    )

    await Promise.all(
      invites.map(async (invite) => {
        return db.UserProjectPermission.create({
          userId: createdUser.id,
          permissionId: invite.permissionId,
          projectId: invite.projectId,
        })
      }),
    )

    res
      .status(200)
      .send(
        createdUser.omitProps([
          "password",
          "token",
          "remainPasswordId",
          "updatedAt",
          "createdAt",
        ]),
      )
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw {
        name: "email",
        message: "Invalid email or password",
      }
    }

    console.log(email, password)

    const user = await db.User.findOne({ where: { email } })

    console.log(user)

    if (!user) {
      throw {
        name: "email",
        message: "Invalid email or password",
      }
    }

    const isConsistent = await bcrypt.compare(
      password,
      user.password,
    )

    if (!isConsistent) {
      throw {
        name: "email",
        message: "Invalid email or password",
      }
    }

    res
      .status(200)
      .send(
        user.omitProps([
          "password",
          "updatedAt",
          "createdAt",
        ]),
      )
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}

const remainPasswordSendMail = async (
  req: RequestBody<RemainPasswordBody>,
  res: Response,
) => {
  try {
    const { email } = req.body

    const user = await db.User.findOne({ where: { email } })

    if (!user) {
      throw {
        name: "email",
        message: "Invalid email or password",
      }
    }

    const { token, url } = createMailToken(email, req)

    console.log("token", token, "url", url)

    let remainPassword

    if (user.remainPasswordId) {
      remainPassword = await db.RemainPassword.update(
        {
          token,
        },
        {
          where: { id: user.remainPasswordId },
        },
      )
    } else {
      remainPassword = await db.RemainPassword.create({
        token,
      })
    }

    await user.setRemainPassword(remainPassword)

    new Mailer(user.email, "changePassword")
      .changePasswordTemplate(url)
      .sendMail()

    res.status(200).send()
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}

const changePassword = async (
  req: RequestBody<ChangePasswordBody>,
  res: Response,
) => {
  try {
    const { token, password, confirmPassword } = req.body

    console.log(token, password, confirmPassword)

    const remainPassword = await db.RemainPassword.findOne({
      where: { token },
    })

    if (!remainPassword) {
      throw {
        name: "remainPassword",
        message: "Invalid token",
      }
    }

    if (password.length < 8) {
      throw {
        name: "password",
        message: "Password should be longer than 8 chars",
      }
    }
    if (password !== confirmPassword) {
      throw {
        name: "password",
        message: "Passwords are inconsistent",
      }
    }

    const user = await db.User.findOne({
      where: { remainPasswordId: remainPassword.id },
    })

    if (!user) {
      throw {
        name: "user",
        message: "User not found",
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const userToken = await createToken(user.email)

    const createdUser = await user.update({
      token: userToken,
      password: hashedPassword,
    })

    res
      .status(200)
      .send(
        createdUser.omitProps([
          "password",
          "token",
          "remainPasswordId",
          "updatedAt",
          "createdAt",
        ]),
      )
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}

export {
  register,
  login,
  remainPasswordSendMail,
  changePassword,
}
