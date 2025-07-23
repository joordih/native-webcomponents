import { BaseAttributes, BaseCreationAttributes } from "@/types/sequelize";
import { DataTypes, Model, Sequelize } from "sequelize";

export interface EventPriceAttributes extends BaseAttributes {
  eventId: number;
  description: string;
  price: number;
}

export interface EventPriceCreationAttributes
  extends Omit<
      EventPriceAttributes,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    >,
    BaseCreationAttributes {
  eventId: number;
  description: string;
  price: number;
}

export class EventPrice
  extends Model<EventPriceAttributes, EventPriceCreationAttributes>
  implements EventPriceAttributes
{
  public id!: number;
  public eventId!: number;
  public description!: string;
  public price!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

export const EventPriceFactory = (sequelize: Sequelize) => {
  EventPrice.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "events",
          key: "id",
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
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
      modelName: "EventPrice",
      tableName: "event_prices",
      paranoid: true,
      timestamps: true,
    }
  );

  return EventPrice;
};
