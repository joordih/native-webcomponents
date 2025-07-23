"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const sequelize_1 = require("sequelize");
const up = async (queryInterface) => {
    await queryInterface.createTable("user_activation_tokens", {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        token: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        used: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
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
    await queryInterface.dropTable("user_activation_tokens");
};
exports.down = down;
//# sourceMappingURL=002-create-user-activation-tokens.js.map