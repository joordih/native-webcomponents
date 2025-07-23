"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const sequelize_1 = require("sequelize");
const up = async (queryInterface) => {
    await queryInterface.createTable("sent_emails", {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userType: {
            type: sequelize_1.DataTypes.ENUM("user", "customer", "promoter"),
            allowNull: false,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        emailTemplate: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        sendAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        readedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        uuid: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
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
    await queryInterface.dropTable("sent_emails");
};
exports.down = down;
//# sourceMappingURL=017-create-sent-emails.js.map