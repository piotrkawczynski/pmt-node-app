import * as express from "express"
import { permissions } from "../controllers"

export const router = express.Router()

router.get("/", permissions.getPermissionsList)
