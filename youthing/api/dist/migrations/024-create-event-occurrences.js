"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const sequelize_1 = require("sequelize");
const up = async (queryInterface) => {
    await queryInterface.createTable("event_occurrences", {
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
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
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
    });
};
exports.up = up;
const down = async (queryInterface) => {
    await queryInterface.dropTable("event_occurrences");
};
exports.down = down;
//# sourceMappingURL=024-create-event-occurrences.js.map