import * as express from "express"
import * as multer from "multer"
import { dir } from "../app"
import { createFileName } from "../utils/createFileName"
import { comments } from "../controllers"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    cb(
      null,
      createFileName(file.fieldname, file.originalname),
    )
  },
})

const upload = multer({ storage })

export const router = express.Router()

router.post("/", upload.array("attachments[]"), comments.createComment)
router.delete("/:id", comments.deleteComment)
