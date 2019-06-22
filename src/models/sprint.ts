import {
  Sequelize,
  Model,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  DataTypes
} from 'sequelize'
import { Issue} from './issue'

export class Sprint extends Model {
  public id!: number
  public number!: number
  public description!: string
  public dateFrom!: Date
  public dateTo!: Date
  public projectId!: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public addIssues: BelongsToManyAddAssociationsMixin<Issue, number>
  public addIssue: BelongsToManyAddAssociationMixin<Issue, number>

  public static associate: (models) => void
}

export const SprintFactory = (sequelize: Sequelize) => {
  Sprint.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      number: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      description: {
        type: new DataTypes.STRING(),
        allowNull: false
      },
      dateFrom: {
        type: DataTypes.DATE,
        allowNull: false
      },
      dateTo: {
        type: DataTypes.DATE,
        allowNull: false
      },
      projectId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'sprint',
      modelName: 'sprint'
    }
  )

  Sprint.associate = models => {
    Sprint.belongsTo(models.Project, { foreignKey: 'projectId' })
    models.Project.hasMany(Sprint, { foreignKey: 'projectId' })

    Sprint.belongsToMany(models.Issue, {
      through: 'issueSprint',
      foreignKey: 'sprintId'
    })
  }
  return Sprint
}
