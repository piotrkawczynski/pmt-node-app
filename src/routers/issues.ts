import * as express from "express"
import * as multer from "multer"
import { dir } from "../app"
import { createFileName } from "../utils/createFileName"
import { issues, comments } from "../controllers"

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

router.post("/", upload.array("attachment[]"), issues.createIssue)
router.patch("/", upload.array("attachment[]"), issues.updateIssue)
router.get("/:id", issues.getIssue)
router.get("/:id/comments", comments.getCommentList)
router.patch("/:id/status", issues.updateIssueStatus)
router.patch("/:id/sprint", issues.updateIssueSprint)
router.delete("/:id", issues.deleteIssue)
