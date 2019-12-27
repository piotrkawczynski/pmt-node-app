import * as bcrypt from "bcrypt"
import {
  RequestBody,
  Response,
} from "../types/express/express"
import { UserLocals } from "../types/locals/userLocals"
import {
  UpdateProfile,
  UpdateProfileValues,
} from "../types/request/user/UpdateProfile"
import { createToken } from "../utils/token"
import { createErrorMessage } from "../utils/utils"

export const updateProfile = async (
  req: RequestBody<UpdateProfile>,
  res: Response<UserLocals>,
) => {
  try {
    const {
      email,
      username,
      firstName,
      lastName,
      password,
    } = req.body

    const { user } = res.locals

    console.log("here")

    const isConsistent = await bcrypt.compare(
      password,
      user.password,
    )

    if (!isConsistent) {
      throw {
        name: "password",
        message: "Invalid password",
      }
    }

    const updateValue: UpdateProfileValues = {
      email,
      username,
      firstName,
      lastName,
      token: user.token,
    }

    if (updateValue.email !== user.email) {
      updateValue.token = await createToken(email)
    }

    const updatedUser = await user.update(updateValue)

    console.log(updatedUser)

    res
      .status(200)
      .send(
        // updatedUser.omitProps([
        //   "password",
        //   "token",
        //   "remainPasswordId",
        //   "updatedAt",
        //   "createdAt",
        // ]),
      )
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
    res.status(400).send(createErrorMessage(error))
  }
}
