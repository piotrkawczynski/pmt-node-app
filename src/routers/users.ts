import * as express from "express"
import { users } from "../controllers"

export const router = express.Router()

router.post("/update-profile", users.updateProfile)
