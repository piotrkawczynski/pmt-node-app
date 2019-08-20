import { Request as ExpressRequest } from "express-serve-static-core"
import { User } from "../../models/user"
import { Project } from "../models/project"

export interface Request extends ExpressRequest {
  user?: User
  project?: Project
}
