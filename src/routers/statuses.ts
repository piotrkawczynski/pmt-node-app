import * as express from "express"
import { statuses } from "../controllers"
import { projectAccessibility } from "../middlewares/projectAccessibility"
import { checkProjectCompletion } from "../middlewares/checkProjectCompletion"

export const router = express.Router()

router.post(
  "/",
  projectAccessibility,
  statuses.createStatus,
)
router.patch("/update-order", statuses.updateStatusOrder)
router.delete(
  "/:id",
  statuses.deleteStatus,
  checkProjectCompletion,
)
