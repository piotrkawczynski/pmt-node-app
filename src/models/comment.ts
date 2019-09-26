import {
  Sequelize,
  DataTypes,
  Model,
  BelongsToManySetAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
} from "sequelize"
import { Attachment } from "./attachment"
import { Issue } from "./issue"

export class Comment extends Model {
  public id!: number
  public code!: number
  public authorId!: number
  public reviewerId!: number
  public assigneeId!: number
  public title!: string
  public description!: string
  public attachmentId!: number
  public permissionId!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public setAttachments!: BelongsToManySetAssociationsMixin<
    Attachment,
    Attachment["id"]
  >
  public getAttachments!: BelongsToManyGetAssociationsMixin<
    Attachment
  >

  public static associate: (models) => void
}

export const CommentFactory = (sequelize: Sequelize) => {
  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      issueId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: new DataTypes.STRING(),
        allowNull: false,
      },
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "comment",
      modelName: "comment",
    },
  )

  Comment.associate = (models) => {
    Comment.belongsTo(models.Issue, {
      foreignKey: "issueId",
    })
    models.Issue.hasMany(Comment, { foreignKey: "issueId" })

    Comment.belongsTo(models.User, {
      foreignKey: "authorId",
    })
    models.User.hasMany(Comment, { foreignKey: "authorId" })

    Comment.belongsTo(models.Permission, {
      foreignKey: "permissionId",
    })
    models.Permission.hasMany(Comment, {
      foreignKey: "permissionId",
    })

    Comment.belongsToMany(models.Attachment, {
      through: "commentAttachment",
      foreignKey: "commentId",
    })
    models.Attachment.belongsToMany(Comment, {
      through: "commentAttachment",
      foreignKey: "attachmentId",
    })
  }

  return Comment
}
