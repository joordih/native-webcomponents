"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const sequelize_1 = require("sequelize");
const up = async (queryInterface) => {
    await queryInterface.createTable("events", {
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
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        townId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "towns",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        spotId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "spots",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        categoryId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "event_categories",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
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
    });
};
exports.up = up;
const down = async (queryInterface) => {
    await queryInterface.dropTable("events");
};
exports.down = down;
//# sourceMappingURL=022-create-events.js.map