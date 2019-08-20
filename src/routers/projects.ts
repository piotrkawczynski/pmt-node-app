import * as express from "express"
import { projects } from "../controllers"
import * as multer from "multer"
import { dir } from "../app"
import { createFileName } from "../utils/createFileName"

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

router.post(
  "/",
  upload.single("avatar"),
  projects.createProject,
)
router.get("/:id/users", projects.getProjectUsers)
router.get("/:id/tags", projects.getProjectTags)
router.get("/:id/statuses", projects.getProjectStatuses)
router.get("/:id", projects.getProject)
router.get("/", projects.getUserProjects)
