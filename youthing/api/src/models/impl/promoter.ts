import { BaseAttributes, BaseCreationAttributes } from "@/types/sequelize";
import { DataTypes, Model, Sequelize } from "sequelize";

export interface PromoterAttributes extends BaseAttributes {
  name: string;
  email: string;
}

export interface PromoterCreationAttributes
  extends Omit<
      PromoterAttributes,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    >,
    BaseCreationAttributes {
  name: string;
  email: string;
}

export class Promoter
  extends Model<PromoterAttributes, PromoterCreationAttributes>
  implements PromoterAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

export const PromoterFactory = (sequelize: Sequelize) => {
  Promoter.init(
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
      modelName: "Promoter",
      tableName: "promoters",
      paranoid: true,
      timestamps: true,
    }
  );

  return Promoter;
};
