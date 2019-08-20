import { Sequelize, DataTypes, Model } from "sequelize"

export class Invite extends Model {
  public id!: number
  public email!: string
  public projectId!: number
  public permissionId!: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const InviteFactory = (sequelize: Sequelize) => {
  Invite.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: new DataTypes.STRING(200),
        allowNull: false,
      },
      projectId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      permissionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "invite",
      modelName: "invite",
    },
  )

  return Invite
}
