import { Sequelize, DataTypes, Model } from "sequelize"
import { Permission } from "./permission"
import { Project } from "./project"
import { User } from "./user"

export class UserProjectPermission extends Model {
  public id!: number
  public projectId!: number
  public userId!: number
  public permissionId!: number

  public permission!: Permission
  public project!: Project
  public user!: User

  public static associate: (models) => void

  public toObject = () => {
    return this.get({ plain: true })
  }
}

export const UserProjectPermissionFactory = (
  sequelize: Sequelize,
) => {
  UserProjectPermission.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      tableName: "userProjectPermission",
      modelName: "userProjectPermission",
    },
  )

  UserProjectPermission.associate = (models) => {
    UserProjectPermission.belongsTo(models.User, {
      foreignKey: "userId",
    })
    models.User.hasMany(UserProjectPermission, {
      foreignKey: "userId",
    })

    UserProjectPermission.belongsTo(models.Project, {
      foreignKey: "projectId",
    })
    models.Project.hasMany(UserProjectPermission, {
      foreignKey: "projectId",
    })

    UserProjectPermission.belongsTo(models.Permission, {
      foreignKey: "permissionId",
    })
    models.Permission.hasMany(UserProjectPermission, {
      foreignKey: "permissionId",
    })
  }

  return UserProjectPermission
}
