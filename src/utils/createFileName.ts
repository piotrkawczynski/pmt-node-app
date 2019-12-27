import * as crypto from "crypto"
import * as path from "path"

export const createFileName = (
  fileName: string,
  originalName: string,
): string => {
  const name: string = crypto
    .createHash("md5")
    .update(fileName + Date.now().toString())
    .digest("hex")

  const extension: string = path
    .extname(originalName)
    .toLowerCase()

  return name + extension
}
