import { Sequelize, DataTypes, Model } from 'sequelize'

export class Tag extends Model {
  public id!: number
  public name!: string
  public attachmentId!: number

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
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      attachmentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'tag',
      modelName: 'tag',
    },
  )

  Tag.associate = (models) => {
    Tag.belongsTo(models.Attachment, { foreignKey: 'attachmentId' })
    models.Attachment.hasOne(Tag, { foreignKey: 'attachmentId' })
  }

  return Tag
}
