import { Sequelize } from 'sequelize'
import { AttachmentFactory } from './attachment'
import { CommentFactory } from './comment'
import { InviteFactory } from './invite'
import { IssueFactory } from './issue'
import { PermissionFactory } from './permission'
import { SprintFactory } from './sprint'
import { StatusFactory } from './status'
import { TagFactory } from './tag'
import { UserFactory } from './user'
import { UserProjectPermissionFactory } from './userProjectPermission'
import { ProjectFactory } from './project'

export const createModels = (sequelizeConfig: any) => {
  const { database, username, password, params } = sequelizeConfig
  const sequelize = new Sequelize(database, username, password, params)

  const db = {
    sequelize,
    Attachment: AttachmentFactory(sequelize),
    Comment: CommentFactory(sequelize),
    Invite: InviteFactory(sequelize),
    Issue: IssueFactory(sequelize),
    Permission: PermissionFactory(sequelize),
    Project: ProjectFactory(sequelize),
    Sprint: SprintFactory(sequelize),
    Status: StatusFactory(sequelize),
    Tag: TagFactory(sequelize),
    User: UserFactory(sequelize),
    UserProjectPermission: UserProjectPermissionFactory(sequelize),
  }

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })

  return db
}
