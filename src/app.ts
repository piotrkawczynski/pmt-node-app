import * as express from "express"
import * as bodyParser from "body-parser"
import * as morgan from "morgan"
import * as path from "path"
import * as cors from "cors"

import config from "./config/config"
import { db } from "./database"
import {
  auth,
  projects,
  tags,
  permissions,
  statuses,
  invites,
  issues,
  comments,
  sprints,
  users,
} from "./routers"
import { getUserByToken } from "./middlewares/token"

const PORT: string | number = process.env.PORT || 3333
export const app = express()

app.set("secret", config.secret)

export const dir = path.join(__dirname, "public")

app.use(cors())
app.use(express.static(dir))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan("dev"))

app.use("/auth", auth)
app.use(getUserByToken)
app.use("/permissions", permissions)
app.use("/projects", projects)
app.use("/users", users)
app.use("/invites", invites)
app.use("/issues", issues)
app.use("/comments", comments)
app.use("/tags", tags)
app.use("/statuses", statuses)
app.use("/sprints", sprints)

db.sequelize
  // .sync({ force: true })
  // .then((result) => seed(db))
  .sync()
  .then(() => app.listen(PORT))
  .then(() =>
    console.log(`Server started on localhost:${PORT}`),
  )
