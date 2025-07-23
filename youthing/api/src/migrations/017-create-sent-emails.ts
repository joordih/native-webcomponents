import { QueryInterface, DataTypes } from "sequelize";

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.createTable("sent_emails", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userType: {
      type: DataTypes.ENUM("user", "customer", "promoter"),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    emailTemplate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sendAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    readedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
  });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.dropTable("sent_emails");
};
