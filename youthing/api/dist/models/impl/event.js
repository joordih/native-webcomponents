"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventFactory = exports.Event = void 0;
const sequelize_1 = require("sequelize");
class Event extends sequelize_1.Model {
}
exports.Event = Event;
const EventFactory = (sequelize) => {
    Event.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        promoterId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "promoters",
                key: "id",
            },
        },
        townId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "towns",
                key: "id",
            },
        },
        spotId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "spots",
                key: "id",
            },
        },
        categoryId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "event_categories",
                key: "id",
            },
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
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
        modelName: "Event",
        tableName: "events",
        paranoid: true,
        timestamps: true,
    });
    return Event;
};
exports.EventFactory = EventFactory;
//# sourceMappingURL=event.js.map