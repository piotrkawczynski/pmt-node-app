import {
  Sequelize,
  DataTypes,
  Model,
  BelongsToSetAssociationMixin,
  BelongsToGetAssociationMixin,
} from "sequelize"
import { Project } from "./project"
import { Attachment } from "./attachment"

export class Status extends Model {
  public id!: number
  public name!: string
  public projectId!: number
  public order!: number

  public attachment!: Attachment
  public image!: string

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
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      projectId: {
        type: DataTypes.INTEGER.UNSIGNED,
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

  Status.associate = (models) => {
    Status.belongsTo(models.Attachment, {
      foreignKey: "attachmentId",
    })
    models.Attachment.hasOne(Status, {
      foreignKey: "attachmentId",
    })
  }

  return Status
}
