import { Sequelize, DataTypes, Model } from "sequelize"

export class RemainPassword extends Model {
  public id!: number
  public token!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static associate: (models) => void
}

export const RemainPasswordFactory = (
  sequelize: Sequelize,
) => {
  RemainPassword.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      token: {
        type: new DataTypes.STRING(),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "remainPassword",
      modelName: "remainPassword",
    },
  )

  RemainPassword.associate = (models) => {
    models.User.belongsTo(RemainPassword, {
      foreignKey: "remainPasswordId",
    })
  }

  return RemainPassword
}
