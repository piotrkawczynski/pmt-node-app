import { Sequelize, DataTypes, Model } from "sequelize"

export class Comment extends Model {
  public id!: number
  public code!: number
  public authorId!: number
  public reviewerId!: number
  public assigneeId!: number
  public title!: string
  public description!: string
  public attachmentId!: number
  public permission!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static associate: (models) => void
}

export const CommentFactory = (sequelize: Sequelize) => {
  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      issueId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      authorId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      description: {
        type: new DataTypes.STRING(),
        allowNull: false,
      },
      attachmentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      permission: {
        type: new DataTypes.STRING(),
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

    Comment.belongsTo(models.Attachment, {
      foreignKey: "attachmentId",
    })
    models.Attachment.hasMany(Comment, {
      foreignKey: "attachmentId",
    })
  }

  return Comment
}
