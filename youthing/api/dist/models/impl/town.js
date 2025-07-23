"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TownFactory = exports.Town = void 0;
const sequelize_1 = require("sequelize");
class Town extends sequelize_1.Model {
}
exports.Town = Town;
const TownFactory = (sequelize) => {
    Town.init({
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
        modelName: "Town",
        tableName: "towns",
        paranoid: true,
        timestamps: true,
    });
    return Town;
};
exports.TownFactory = TownFactory;
//# sourceMappingURL=town.js.map