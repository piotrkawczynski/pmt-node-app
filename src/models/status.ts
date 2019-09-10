import {
  Sequelize,
  DataTypes,
  Model,
  BelongsToSetAssociationMixin,
  BelongsToGetAssociationMixin,
} from "sequelize"
import { Project } from "./project"

export class Status extends Model {
  public id!: number
  public name!: string
  public projectId!: number
  public order!: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public setProject!: BelongsToSetAssociationMixin<
    Project,
    Project["id"]
  >
  public getProject!: BelongsToGetAssociationMixin<Project>

  public static associate: (models) => void
}

export const StatusFactory = (sequelize: Sequelize) => {
  Status.init(
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
      projectId: {
        type: DataTypes.INTEGER,
      },
      order: {
        type: new DataTypes.INTEGER(),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "status",
      modelName: "status",
    },
  )

  return Status
}
