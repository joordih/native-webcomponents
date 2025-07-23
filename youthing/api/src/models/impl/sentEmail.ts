import {
  BaseAttributes,
  BaseCreationAttributes,
  UserType,
} from "@/types/sequelize";
import { DataTypes, Model, Sequelize } from "sequelize";

export interface SentEmailAttributes extends BaseAttributes {
  userType: UserType;
  userId: number;
  emailTemplate: string;
  sendAt: Date;
  readedAt?: Date;
  uuid: string;
}

export interface SentEmailCreationAttributes
  extends Omit<
      SentEmailAttributes,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    >,
    BaseCreationAttributes {
  userType: UserType;
  userId: number;
  emailTemplate: string;
  sendAt: Date;
  readedAt?: Date;
  uuid: string;
}

export class SentEmail
  extends Model<SentEmailAttributes, SentEmailCreationAttributes>
  implements SentEmailAttributes
{
  public id!: number;
  public userType!: UserType;
  public userId!: number;
  public emailTemplate!: string;
  public sendAt!: Date;
  public readedAt?: Date;
  public uuid!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

export const SentEmailFactory = (sequelize: Sequelize) => {
  SentEmail.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userType: {
        type: DataTypes.ENUM("user", "customer", "promoter"),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      emailTemplate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sendAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      readedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      uuid: {
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
      modelName: "SentEmail",
      tableName: "sent_emails",
      paranoid: true,
      timestamps: true,
    }
  );

  return SentEmail;
};
