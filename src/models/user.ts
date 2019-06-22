import {
  Sequelize,
  DataTypes,
  Model,
  HasManyGetAssociationsMixin,
} from 'sequelize'
import { omit } from 'lodash'
import { Project } from './project'
import { UserProjectPermission } from './userProjectPermission'

export class User extends Model {
  public id!: number
  public email!: string
  public password!: string
  public username!: string
  public firstName!: string
  public lastName!: string
  public token!: string

  public getUserProjectPermissions!: HasManyGetAssociationsMixin<
    UserProjectPermission
  >

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public toObject = () => {
    return this.get({ plain: true })
  }
  public omitProps = (omitProps: string[] = ['createdAt, updatedAt']) => {
    return omit(this.toObject(), omitProps)
  }
}

export const UserFactory = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Required',
          },
          isEmail: {
            msg: 'Invalid email format',
          },
        },
      },
      password: {
        type: new DataTypes.STRING(),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Required',
          },
        },
      },
      username: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Required',
          },
        },
      },
      firstName: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Required',
          },
        },
      },
      lastName: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Required',
          },
        },
      },
      token: {
        type: new DataTypes.STRING(),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'user',
      modelName: 'user',
    },
  )

  return User
}
