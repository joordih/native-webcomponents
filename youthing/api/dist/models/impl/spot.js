"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotFactory = exports.Spot = void 0;
const sequelize_1 = require("sequelize");
class Spot extends sequelize_1.Model {
}
exports.Spot = Spot;
const SpotFactory = (sequelize) => {
    Spot.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        townId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "towns",
                key: "id",
            },
        },
        promoterId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "promoters",
                key: "id",
            },
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        address: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        latitude: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        },
        longitude: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        },
        environment: {
            type: sequelize_1.DataTypes.ENUM("indoor", "outdoor", "mixed"),
            allowNull: false,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
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
        modelName: "Spot",
        tableName: "spots",
        paranoid: true,
        timestamps: true,
    });
    return Spot;
};
exports.SpotFactory = SpotFactory;
//# sourceMappingURL=spot.js.map