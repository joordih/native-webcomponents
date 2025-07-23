import { BaseAttributes, BaseCreationAttributes } from "@/types/sequelize";
import { DataTypes, Model, Sequelize } from "sequelize";

export interface UserActivationTokenAttributes extends BaseAttributes {
  userId: number;
  token: string;
  expirationDate: Date;
  used: boolean;
}

export interface UserActivationTokenCreationAttributes
  extends Omit<
      UserActivationTokenAttributes,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    >,
    BaseCreationAttributes {
  userId: number;
  token: string;
  expirationDate: Date;
}

export class UserActivationToken
  extends Model<
    UserActivationTokenAttributes,
    UserActivationTokenCreationAttributes
  >
  implements UserActivationTokenAttributes
{
  public id!: number;
  public userId!: number;
  public token!: string;
  public expirationDate!: Date;
  public used!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

export const UserActivationTokenFactory = (sequelize: Sequelize) => {
  UserActivationToken.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      modelName: "UserActivationToken",
      tableName: "user_activation_tokens",
      paranoid: true,
      timestamps: true,
    }
  );

  return UserActivationToken;
};
