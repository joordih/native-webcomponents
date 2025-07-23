import { BaseAttributes, BaseCreationAttributes } from "@/types/sequelize";
import { DataTypes, Model, Sequelize } from "sequelize";

export interface UserAttributes extends BaseAttributes {
  name: string;
  email: string;
}

export interface UserCreationAttributes
  extends Omit<UserAttributes, "id" | "createdAt" | "updatedAt" | "deletedAt">,
    BaseCreationAttributes {
  name: string;
  email: string;
}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

export const UserFactory = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      paranoid: true,
      timestamps: true,
    }
  );

  return User;
};
