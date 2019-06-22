import * as bcrypt from "bcrypt"
import { omit } from "lodash"

import { db } from "../database"
import { createToken } from "../utils/token"
import { createErrorMessage } from "../utils/utils"
import { Response } from "express"

const register = async (req, res: Response) => {
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

    const createdUser = await db.User.create(
      omit(userValues, ["confirmPassword"]),
    )

    res
      .status(200)
      .send(
        createdUser.omitProps([
          "password",
          "token",
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await db.User.findOne({ where: { email } })

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

export { register, login }
