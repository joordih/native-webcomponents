"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventPriceFactory = exports.EventPrice = void 0;
const sequelize_1 = require("sequelize");
class EventPrice extends sequelize_1.Model {
}
exports.EventPrice = EventPrice;
const EventPriceFactory = (sequelize) => {
    EventPrice.init({
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
        description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
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
        modelName: "EventPrice",
        tableName: "event_prices",
        paranoid: true,
        timestamps: true,
    });
    return EventPrice;
};
exports.EventPriceFactory = EventPriceFactory;
//# sourceMappingURL=eventPrice.js.map