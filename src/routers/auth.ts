import * as express from "express"
import { auth } from "../controllers"

export const router = express.Router()

router.post("/register", auth.register)

router.post("/login", auth.login)
