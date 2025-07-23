"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserActivationTokenFactory = exports.UserActivationToken = void 0;
const sequelize_1 = require("sequelize");
class UserActivationToken extends sequelize_1.Model {
}
exports.UserActivationToken = UserActivationToken;
const UserActivationTokenFactory = (sequelize) => {
    UserActivationToken.init({
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
    }, {
        sequelize,
        modelName: "UserActivationToken",
        tableName: "user_activation_tokens",
        paranoid: true,
        timestamps: true,
    });
    return UserActivationToken;
};
exports.UserActivationTokenFactory = UserActivationTokenFactory;
//# sourceMappingURL=userActivationToken.js.map