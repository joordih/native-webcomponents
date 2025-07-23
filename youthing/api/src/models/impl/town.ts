import { BaseAttributes, BaseCreationAttributes } from "@/types/sequelize";
import { DataTypes, Model, Sequelize } from "sequelize";

export interface TownAttributes extends BaseAttributes {
  name: string;
}

export interface TownCreationAttributes
  extends Omit<TownAttributes, "id" | "createdAt" | "updatedAt" | "deletedAt">,
    BaseCreationAttributes {
  name: string;
}

export class Town
  extends Model<TownAttributes, TownCreationAttributes>
  implements TownAttributes
{
  public id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

export const TownFactory = (sequelize: Sequelize) => {
  Town.init(
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
      modelName: "Town",
      tableName: "towns",
      paranoid: true,
      timestamps: true,
    }
  );

  return Town;
};
