import * as express from "express"
import { projectAccessibility } from "../middlewares/projectAccessibility"
import { sprints } from "../controllers"

export const router = express.Router()

router.post("/", projectAccessibility, sprints.createSprint)
router.patch("/:id", sprints.updateSprint)
router.delete("/:id", sprints.deleteSprint)
router.get("/:id/issues?:lastSprint", sprints.getIssueList)
