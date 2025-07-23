import { BaseAttributes, BaseCreationAttributes } from "@/types/sequelize";
import { DataTypes, Model, Sequelize } from "sequelize";

export interface BotAttributes extends BaseAttributes {
  name: string;
  description?: string;
  platform: string;
  token: string;
}

export interface BotCreationAttributes
  extends Omit<BotAttributes, "id" | "createdAt" | "updatedAt" | "deletedAt">,
    BaseCreationAttributes {
  name: string;
  description?: string;
  platform: string;
  token: string;
}

export class Bot
  extends Model<BotAttributes, BotCreationAttributes>
  implements BotAttributes
{
  public id!: number;
  public name!: string;
  public description?: string;
  public platform!: string;
  public token!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

export const BotFactory = (sequelize: Sequelize) => {
  Bot.init(
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      platform: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
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
      modelName: "Bot",
      tableName: "bots",
      paranoid: true,
      timestamps: true,
    }
  );

  return Bot;
};
