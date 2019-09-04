import { Sequelize, DataTypes, Model } from "sequelize"

export class Tag extends Model {
  public id!: number
  public name!: string
  public image!: string
  public projectId!: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static associate: (models) => void
}

export const TagFactory = (sequelize: Sequelize) => {
  Tag.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: new DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Required",
          },
        },
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "tag",
      modelName: "tag",
    },
  )

  return Tag
}
