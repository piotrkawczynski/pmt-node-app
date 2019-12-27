import { Sequelize, DataTypes, Model } from "sequelize"
import { Issue } from "./issue"

export class Attachment extends Model {
  public id!: number
  public image!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const AttachmentFactory = (sequelize: Sequelize) => {
  Attachment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      image: {
        type: new DataTypes.STRING(),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "attachment",
      modelName: "attachment",
    },
  )

  return Attachment
}
