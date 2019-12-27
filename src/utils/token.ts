import { sign, verify } from "jsonwebtoken"
import { app } from "../app"
import * as base64url from "base64-url"
import { format } from "url"
import { Request } from "../types/express/express"

export const createToken = (data): Promise<string> =>
  new Promise((resolve, reject) => {
    sign(
      {
        data,
      },
      app.get("secret"),
      {
        expiresIn: "2000h",
      },
      (err, encoded) => {
        if (err) {
          return reject(err)
        }

        return resolve(encoded)
      },
    )
  })

export const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    verify(token, app.get("secret"), (err, decoded) => {
      if (err) {
        return reject(err)
      }

      return resolve(decoded)
    })
  })

export const createMailToken = (
  email: string,
  req: Request,
) => {
  const token = base64url.encode(
    `${email}${new Date().getTime()}`,
  )

  const url = format({
    host: req.get("origin"),
    pathname: "/change-password",
    query: { token },
  })

  return { token, url }
}
