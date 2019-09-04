import * as express from "express"
import { projectAccessibility } from "../middlewares/projectAccessibility"
import { invites } from "../controllers"

export const router = express.Router()

router.post("/", projectAccessibility, invites.createInvite)

router.delete("/:id", invites.deleteInvite)
