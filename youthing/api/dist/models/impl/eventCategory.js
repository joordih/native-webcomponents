"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventCategoryFactory = exports.EventCategory = void 0;
const sequelize_1 = require("sequelize");
class EventCategory extends sequelize_1.Model {
}
exports.EventCategory = EventCategory;
const EventCategoryFactory = (sequelize) => {
    EventCategory.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
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
        modelName: "EventCategory",
        tableName: "event_categories",
        paranoid: true,
        timestamps: true,
    });
    return EventCategory;
};
exports.EventCategoryFactory = EventCategoryFactory;
//# sourceMappingURL=eventCategory.js.map