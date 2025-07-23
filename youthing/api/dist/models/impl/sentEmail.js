"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentEmailFactory = exports.SentEmail = void 0;
const sequelize_1 = require("sequelize");
class SentEmail extends sequelize_1.Model {
}
exports.SentEmail = SentEmail;
const SentEmailFactory = (sequelize) => {
    SentEmail.init({
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
    }, {
        sequelize,
        modelName: "SentEmail",
        tableName: "sent_emails",
        paranoid: true,
        timestamps: true,
    });
    return SentEmail;
};
exports.SentEmailFactory = SentEmailFactory;
//# sourceMappingURL=sentEmail.js.map