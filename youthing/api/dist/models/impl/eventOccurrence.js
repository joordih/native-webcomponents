"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventOccurrenceFactory = exports.EventOccurrence = void 0;
const sequelize_1 = require("sequelize");
class EventOccurrence extends sequelize_1.Model {
}
exports.EventOccurrence = EventOccurrence;
const EventOccurrenceFactory = (sequelize) => {
    EventOccurrence.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        eventId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "events",
                key: "id",
            },
        },
        startDateTime: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        endDateTime: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: "EventOccurrence",
        tableName: "event_occurrences",
        paranoid: true,
        timestamps: true,
    });
    return EventOccurrence;
};
exports.EventOccurrenceFactory = EventOccurrenceFactory;
//# sourceMappingURL=eventOccurrence.js.map