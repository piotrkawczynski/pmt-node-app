import {
  Sequelize,
  DataTypes,
  Model,
  HasManySetAssociationsMixin,
} from "sequelize"
import { Status } from "./status"
import { Tag } from "./tag"
import { Invite } from "./invite"

export class Project extends Model {
  public id!: number
  public name!: string
  public company!: string
  public avatar!: string
  public label!: string
  public color!: string
  public sprintDuration!: number
  public completed!: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public setStatuses!: HasManySetAssociationsMixin<
    Status,
    number
  >
  public setInvites!: HasManySetAssociationsMixin<
    Invite,
    number
  >

  public setTags!: HasManySetAssociationsMixin<Tag, number>

  public static associate: (models) => void
}

export const ProjectFactory = (sequelize: Sequelize) => {
  Project.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      company: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      label: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      color: {
        type: new DataTypes.STRING(7),
        allowNull: false,
      },
      sprintDuration: {
        type: new DataTypes.INTEGER,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: "project",
      modelName: "project",
    },
  )

  Project.associate = (models) => {
    Project.hasMany(models.Status, {
      foreignKey: "projectId",
    })
    models.Status.belongsTo(Project, {
      foreignKey: "projectId",
    })

    Project.hasMany(models.Tag, { foreignKey: "projectId" })
    models.Tag.belongsTo(Project, {
      foreignKey: "projectId",
    })

    Project.hasMany(models.Invite, {
      foreignKey: "projectId",
    })
    models.Invite.belongsTo(Project, {
      foreignKey: "projectId",
    })
  }

  return Project
}
