'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'status', {
      type: Sequelize.ENUM('active', 'inactive', 'pending'),
      defaultValue: 'pending',
      allowNull: false
    });

    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'user', 'moderator'),
      defaultValue: 'user',
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'status');
    await queryInterface.removeColumn('users', 'role');
  }
}
