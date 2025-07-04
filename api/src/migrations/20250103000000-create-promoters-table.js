'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('promoters', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      published: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'pending'),
        defaultValue: 'pending',
        allowNull: true
      },
      role: {
        type: Sequelize.ENUM('admin', 'user', 'moderator'),
        defaultValue: 'user',
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('promoters')
  }
}