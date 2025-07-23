import { BaseAttributes, BaseCreationAttributes } from "@/types/sequelize";
import { DataTypes, Model, Sequelize } from "sequelize";

export interface EventAttributes extends BaseAttributes {
  promoterId: number;
  townId: number;
  spotId: number;
  categoryId: number;
  title: string;
  description?: string;
  price: number;
}

export interface EventCreationAttributes
  extends Omit<EventAttributes, "id" | "createdAt" | "updatedAt" | "deletedAt">,
    BaseCreationAttributes {
  promoterId: number;
  townId: number;
  spotId: number;
  categoryId: number;
  title: string;
  description?: string;
  price: number;
}

export class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  public id!: number;
  public promoterId!: number;
  public townId!: number;
  public spotId!: number;
  public categoryId!: number;
  public title!: string;
  public description?: string;
  public price!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

export const EventFactory = (sequelize: Sequelize) => {
  Event.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      promoterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "promoters",
          key: "id",
        },
      },
      townId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "towns",
          key: "id",
        },
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "spots",
          key: "id",
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "event_categories",
          key: "id",
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
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
      modelName: "Event",
      tableName: "events",
      paranoid: true,
      timestamps: true,
    }
  );

  return Event;
};
