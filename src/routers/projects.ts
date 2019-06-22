import * as express from "express"
import { projects } from "../controllers"

export const router = express.Router()

// router.get('/:id/users', projects.getProjectStatuses)
router.get("/:id/tags", projects.getProjectTags)
router.get("/:id/statuses", projects.getProjectStatuses)
router.get("/:id", projects.getProject)
router.get("/", projects.getUserProjects)
