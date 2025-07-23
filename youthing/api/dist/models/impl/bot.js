"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotFactory = exports.Bot = void 0;
const sequelize_1 = require("sequelize");
class Bot extends sequelize_1.Model {
}
exports.Bot = Bot;
const BotFactory = (sequelize) => {
    Bot.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        platform: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        token: {
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
        modelName: "Bot",
        tableName: "bots",
        paranoid: true,
        timestamps: true,
    });
    return Bot;
};
exports.BotFactory = BotFactory;
//# sourceMappingURL=bot.js.map