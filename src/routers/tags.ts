import * as express from "express"
import { tags } from "../controllers"

export const router = express.Router()

router.post("/", tags.createTag)
