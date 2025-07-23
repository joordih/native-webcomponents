"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerFactory = exports.Customer = void 0;
const sequelize_1 = require("sequelize");
class Customer extends sequelize_1.Model {
}
exports.Customer = Customer;
const CustomerFactory = (sequelize) => {
    Customer.init({
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
        birthDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: true,
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
        modelName: "Customer",
        tableName: "customers",
        paranoid: true,
        timestamps: true,
    });
    return Customer;
};
exports.CustomerFactory = CustomerFactory;
//# sourceMappingURL=customer.js.map