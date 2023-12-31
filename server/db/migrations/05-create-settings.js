'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('settings', {
      key: {
        unique: true,
        primaryKey: true,
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.JSONB
      },
      deleted: {
        type: Sequelize.BOOLEAN
      }
    });
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('settings', { cascade: true });
  }
};
