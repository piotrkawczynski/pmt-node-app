import { Model, DataTypes, Sequelize } from "sequelize"

export class Issue extends Model {
  public id!: number
  public code!: number
  public authorId!: number
  public reviewerId!: number
  public assigneeId!: number
  public title!: string
  public description!: string
  public attachmentId!: number
  public tagId!: number
  public projectId!: number
  public statusId!: number
  public order!: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static associate: (models) => void
}

export const IssueFactory = (sequelize: Sequelize) => {
  Issue.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      code: {
        type: new DataTypes.INTEGER(),
        allowNull: false,
      },
      reviewerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      assigneeId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      authorId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      title: {
        type: new DataTypes.STRING(),
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
      tagId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      projectId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      statusId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      order: {
        type: new DataTypes.INTEGER(),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "issue",
      modelName: "issue",
    },
  )

  Issue.associate = (models) => {
    Issue.belongsTo(models.User, {
      foreignKey: "reviewerId",
      as: "reviewer",
    })
    models.User.hasMany(Issue, {
      foreignKey: "reviewerId",
      as: "reviewer",
    })

    Issue.belongsTo(models.User, {
      foreignKey: "assigneeId",
      as: "assignee",
    })
    models.User.hasMany(Issue, {
      foreignKey: "assigneeId",
      as: "assignee",
    })

    Issue.belongsTo(models.User, {
      foreignKey: "authorId",
      as: "author",
    })
    models.User.hasMany(Issue, {
      foreignKey: "authorId",
      as: "author",
    })

    Issue.belongsTo(models.Attachment, {
      foreignKey: "attachmentId",
    })
    models.Attachment.hasMany(Issue, {
      foreignKey: "attachmentId",
    })

    Issue.belongsTo(models.Status, {
      foreignKey: "statusId",
    })
    models.Status.hasMany(Issue, { foreignKey: "statusId" })

    Issue.belongsTo(models.Tag, { foreignKey: "tagId" })
    models.Tag.hasMany(Issue, { foreignKey: "tagId" })

    Issue.belongsTo(models.Project, {
      foreignKey: "projectId",
    })
    models.Project.hasMany(Issue, {
      foreignKey: "projectId",
    })

    Issue.belongsToMany(models.Sprint, {
      through: "issueSprint",
      foreignKey: "issueId",
    })
  }

  return Issue
}
