import { BaseAttributes, BaseCreationAttributes } from "@/types/sequelize";
import { DataTypes, Model, Sequelize } from "sequelize";

export interface EventOccurrenceAttributes extends BaseAttributes {
  eventId: number;
  startDateTime: Date;
  endDateTime: Date;
}

export interface EventOccurrenceCreationAttributes
  extends Omit<
      EventOccurrenceAttributes,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    >,
    BaseCreationAttributes {
  eventId: number;
  startDateTime: Date;
  endDateTime: Date;
}

export class EventOccurrence
  extends Model<EventOccurrenceAttributes, EventOccurrenceCreationAttributes>
  implements EventOccurrenceAttributes
{
  public id!: number;
  public eventId!: number;
  public startDateTime!: Date;
  public endDateTime!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

export const EventOccurrenceFactory = (sequelize: Sequelize) => {
  EventOccurrence.init(
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
      startDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDateTime: {
        type: DataTypes.DATE,
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
      modelName: "EventOccurrence",
      tableName: "event_occurrences",
      paranoid: true,
      timestamps: true,
    }
  );

  return EventOccurrence;
};
