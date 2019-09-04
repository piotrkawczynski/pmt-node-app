import * as express from "express"
import { projects } from "../controllers"
import * as multer from "multer"
import { dir } from "../app"
import { createFileName } from "../utils/createFileName"
import { checkProjectAccess } from "../middlewares/checkProjectAccess"

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
router.get(
  "/:id/invites",
  checkProjectAccess,
  projects.getProjectInvites,
)
router.get(
  "/:id/users",
  checkProjectAccess,
  projects.getProjectUsers,
)
router.get(
  "/:id/tags",
  checkProjectAccess,
  projects.getProjectTags,
)
router.get(
  "/:id/statuses",
  checkProjectAccess,
  projects.getProjectStatuses,
)
router.get(
  "/:id/sprints",
  checkProjectAccess,
  projects.getProjectSprints,
)
router.get("/:id", checkProjectAccess, projects.getProject)
router.get("/", projects.getUserProjects)
