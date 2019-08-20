import * as express from "express"
import { tags } from "../controllers"
import { projectAccessibility } from "../middlewares/projectAccessibility"
import * as multer from "multer"
import { dir } from "../app"
import { createFileName } from "../utils/createFileName"

export const router = express.Router()

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

router.post(
  "/",
  upload.single("image"),
  projectAccessibility,
  tags.createTag,
)
