import { BaseAttributes, BaseCreationAttributes } from "@/types/sequelize";
import { DataTypes, Model, Sequelize } from "sequelize";

export interface EventCategoryAttributes extends BaseAttributes {
  name: string;
}

export interface EventCategoryCreationAttributes
  extends Omit<
      EventCategoryAttributes,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    >,
    BaseCreationAttributes {
  name: string;
}

export class EventCategory
  extends Model<EventCategoryAttributes, EventCategoryCreationAttributes>
  implements EventCategoryAttributes
{
  public id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

export const EventCategoryFactory = (sequelize: Sequelize) => {
  EventCategory.init(
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
      modelName: "EventCategory",
      tableName: "event_categories",
      paranoid: true,
      timestamps: true,
    }
  );

  return EventCategory;
};
