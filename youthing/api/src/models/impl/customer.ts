import { BaseAttributes, BaseCreationAttributes } from "@/types/sequelize";
import { DataTypes, Model, Sequelize } from "sequelize";

export interface CustomerAttributes extends BaseAttributes {
  name: string;
  email: string;
  birthDate?: string;
}

export interface CustomerCreationAttributes
  extends Omit<
      CustomerAttributes,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    >,
    BaseCreationAttributes {
  name: string;
  email: string;
  birthDate?: string;
}

export class Customer
  extends Model<CustomerAttributes, CustomerCreationAttributes>
  implements CustomerAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public birthDate?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

export const CustomerFactory = (sequelize: Sequelize) => {
  Customer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Customer",
      tableName: "customers",
      paranoid: true,
      timestamps: true,
    }
  );

  return Customer;
};
