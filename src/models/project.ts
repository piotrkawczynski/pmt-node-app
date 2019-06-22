import { Sequelize, DataTypes, Model } from "sequelize"

export class Project extends Model {
  public id!: number
  public name!: string
  public company!: string
  public image!: string
  public title!: string
  public color!: string
  public sprintDuration!: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static associate: (models) => void
}

export const ProjectFactory = (sequelize: Sequelize) => {
  Project.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
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
      image: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      title: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      color: {
        type: new DataTypes.STRING(7),
        allowNull: false,
      },
      sprintDuration: {
        type: new DataTypes.INTEGER(),
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
  }

  return Project
}
