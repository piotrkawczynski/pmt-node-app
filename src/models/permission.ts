import { Sequelize, DataTypes, Model } from "sequelize"

export class Permission extends Model {
  public id!: number
  public description!: string
  public permission!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const PermissionFactory = (sequelize: Sequelize) => {
  Permission.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      description: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      permission: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "permission",
      modelName: "permission",
    },
  )

  return Permission
}
