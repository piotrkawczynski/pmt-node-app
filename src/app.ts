import * as express from "express"
import * as bodyParser from "body-parser"
import * as morgan from "morgan"
import * as path from "path"

import config from "./config/config"
import { db } from "./database"
// import { seed } from './seeds/seed'
import { auth, projects, users, tags } from "./routers"
import { getUserByToken } from "./middlewares/token"
import { seed } from "./seeds/seed"

const PORT: string | number = process.env.PORT || 3000
export const app = express()

app.set("secret", config.secret)

const dir = path.join(__dirname, "public")

app.use(express.static(dir))

app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE",
  )
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  )
  next()
})
app.use(morgan("dev"))
app.use("/auth", auth)
app.use(getUserByToken)
app.use("/projects", projects)
app.use("/users", users)
app.use("/tags", tags)

db.sequelize
  // .sync({ force: true })
  // .then((result) => seed(db))
  .sync()
  .then(() => app.listen(PORT))
  .then(() =>
    console.log("Server started on localhost:3000"),
  )
