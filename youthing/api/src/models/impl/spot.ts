import { DataTypes, Model, Sequelize } from "sequelize";
import {
  BaseAttributes,
  BaseCreationAttributes,
  Environment,
} from "@/types/sequelize";

export interface SpotAttributes extends BaseAttributes {
  townId: number;
  promoterId: number;
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  environment: Environment;
  isActive: boolean;
}

export interface SpotCreationAttributes
  extends Omit<SpotAttributes, "id" | "createdAt" | "updatedAt" | "deletedAt">,
    BaseCreationAttributes {
  townId: number;
  promoterId: number;
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  environment: Environment;
}

export class Spot
  extends Model<SpotAttributes, SpotCreationAttributes>
  implements SpotAttributes
{
  public id!: number;
  public townId!: number;
  public promoterId!: number;
  public name!: string;
  public description?: string;
  public address!: string;
  public latitude!: number;
  public longitude!: number;
  public environment!: Environment;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

export const SpotFactory = (sequelize: Sequelize) => {
  Spot.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      townId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "towns",
          key: "id",
        },
      },
      promoterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "promoters",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      environment: {
        type: DataTypes.ENUM("indoor", "outdoor", "mixed"),
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      modelName: "Spot",
      tableName: "spots",
      paranoid: true,
      timestamps: true,
    }
  );

  return Spot;
};
