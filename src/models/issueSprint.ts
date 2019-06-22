import { Sequelize, DataTypes, Model } from 'sequelize'

export class IssueSprint extends Model {
  public id!: number
  public issueId!: number
  public sprintId!: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const IssueSprintFactory = (sequelize: Sequelize) => {
  IssueSprint.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      issueId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      sprintId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      }
    },
    {
      sequelize,
      tableName: 'issueSprint',
      modelName: 'issueSprint'
    }
  )

  return IssueSprint
}
