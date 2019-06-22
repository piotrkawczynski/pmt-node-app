import { Sequelize, DataTypes, Model } from "sequelize"

export class Attachment extends Model {
  public id!: number
  public name!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const AttachmentFactory = (sequelize: Sequelize) => {
  Attachment.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
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
