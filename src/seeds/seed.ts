import { Status } from "../models/status"
import { Project } from "../models/project"
import Bluebird = require("bluebird")
import { Tag } from "../models/tag"
import { Attachment } from "../models/attachment"
import { Issue } from "../models/issue"
import { Sprint } from "../models/sprint"

const seedAttachment = async (db) => {
  const image: Bluebird<Attachment> = db.Attachment.create({
    id: 1,
    name: "cat.jpg",
  })
}

const seedUser = async (db) => {
  const User1 = new db.User()

  User1.id = 1
  User1.firstName = "Piotr"
  User1.lastName = "Kawczyński"
  User1.email = "kawczyniak@gmail.com"
  User1.username = "Piotr Kawczyński"
  User1.password = "password"
  User1.token = "token"

  const User2 = new db.User()

  User2.id = 2
  User2.firstName = "Tomasz"
  User2.lastName = "Kowalski"
  User2.email = "tomasz.kowalski@pmt.io"
  User2.username = "Tomasz Kowalski"
  User2.password = "password"
  User2.token = "token"

  return Promise.all([User1.save(), User2.save()])
}

const seedProject = async (db) => {
  const project: Bluebird<Project> = db.Project.create({
    id: 1,
    name: "Mobile Project name",
    company: "Mobile Company",
    title: "Mobile project title",
    color: "#FF8800",
    sprintDuration: 7,
    image: "cat.jpg",
  })

  return project
}

const seedStatus = async (db) => {
  const statuses: Promise<
    [Status, Status, Status, Status]
  > = Promise.all([
    db.Status.create({
      name: "To do",
      order: 1,
      projectId: 1,
      attachmentId: 1,
    }),
    db.Status.create({
      name: "In progress",
      order: 2,
      projectId: 1,
      attachmentId: 1,
    }),
    db.Status.create({
      name: "In test",
      order: 3,
      projectId: 1,
      attachmentId: 1,
    }),
    db.Status.create({
      name: "Done",
      order: 4,
      projectId: 1,
      attachmentId: 1,
    }),
  ])

  return statuses
}

const seedTag = async (db) => {
  const tags: Promise<[Tag, Tag]> = Promise.all([
    db.Tag.create({ name: "Bug", attachmentId: 1 }),
    db.Tag.create({ name: "Feature", attachmentId: 1 }),
  ])

  return tags
}

const seedSprint = async (db) => {
  const sprint: Promise<[Sprint, Sprint]> = Promise.all([
    db.Sprint.create({
      number: 1,
      description: "Despription sprint 1",
      dateFrom: new Date(2019, 4, 1),
      dateTo: new Date(2019, 4, 8),
      projectId: 1,
    }),
    db.Sprint.create({
      number: 2,
      description: "Despription sprint 2",
      dateFrom: new Date(2019, 4, 8),
      dateTo: new Date(2019, 4, 15),
      projectId: 1,
    }),
  ])

  return sprint
}

const seedIssue = async (db) => {
  const issues: Promise<Issue[]> = Promise.all([
    db.Issue.create({
      code: 1,
      authorId: 1,
      reviewerId: 2,
      assigneeId: 2,
      title: "Issue title 1",
      description: "Issue description 1",
      attachmentId: 1,
      tagId: 1,
      projectId: 1,
      statusId: 1,
      order: 1,
    }),
    db.Issue.create({
      code: 2,
      authorId: 2,
      reviewerId: 1,
      assigneeId: 1,
      title: "Issue title 2",
      description: "Issue description 2",
      attachmentId: 1,
      tagId: 2,
      projectId: 1,
      statusId: 2,
      order: 1,
    }),
  ])
  return issues
}

export const seed = async (db) => {
  try {
    const image = await seedAttachment(db)
    const user = await seedUser(db)
    const project = await seedProject(db)
    const status = await seedStatus(db)
    const tag = await seedTag(db)
    const sprint = await seedSprint(db)
    const issues = await seedIssue(db)
    await sprint[0].addIssues(issues as Issue[])
    await sprint[1].addIssues(issues as Issue[])

    return Promise.resolve()
  } catch (error) {
    console.log(error)
  }
}
