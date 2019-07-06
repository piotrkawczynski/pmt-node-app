import { Request, Response } from "express"
import * as url from "url"
import { Status } from "../models/status"
import { Model, ValidationError } from "sequelize"

export const createImageUrl = (
  req: Request,
  fileName: string,
) => {
  return url.format({
    protocol: req.protocol,
    host: req.get("host"),
    pathname: fileName,
  })
}

export const updateObjectWithUrl = <T extends {}>(
  req,
  object: T,
) => {
  // @ts-ignore
  const plainObject = object.get({ plain: true }) as any
  if (!plainObject.attachment) {
    plainObject.image = null
  } else {
    plainObject.image = createImageUrl(
      req,
      plainObject.attachment.name,
    )
  }
  delete plainObject.attachment
  // delete plainObject.attachmentId

  return omit(plainObject, ["attachment", "attachmentId"])
}

export const createErrorMessage = (thrownError: any) => {
  const error: any = {}

  console.log("thrownError", thrownError.message)
  console.log("thrownError", thrownError.name)

  if (thrownError instanceof ValidationError) {
    thrownError.errors.map((err) => {
      error[err.path] = err.message
    })
  } else if (thrownError.name) {
    error[thrownError.name] = thrownError.message
  } else {
    error.message = thrownError.message
  }

  return { errors: error }
}

export const omit = (
  object: object,
  properties: string[],
) => {
  properties.forEach((property) => {
    delete object[property]
  })

  return object
}

//
// const updateObjectWithUrl = (object: <T>) => statuses.map((status) => {
//   const statusObject = status.get({plain: true}) as Status
//   if (!statusObject.attachment) {
//     statusObject.image = null
//   } else {
//     statusObject.image = createImageUrl(req, status.attachment.name)
//   }
//   return omit(statusObject, ['attachment', 'attachmentId'])
// })
