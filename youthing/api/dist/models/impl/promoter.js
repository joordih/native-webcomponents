"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoterFactory = exports.Promoter = void 0;
const sequelize_1 = require("sequelize");
class Promoter extends sequelize_1.Model {
}
exports.Promoter = Promoter;
const PromoterFactory = (sequelize) => {
    Promoter.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        email: {
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
    }, {
        sequelize,
        modelName: "Promoter",
        tableName: "promoters",
        paranoid: true,
        timestamps: true,
    });
    return Promoter;
};
exports.PromoterFactory = PromoterFactory;
//# sourceMappingURL=promoter.js.map