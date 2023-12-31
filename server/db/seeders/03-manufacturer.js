'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('manufacturer', [
      {
        id: '4abedb72-1411-4844-a04a-58dbcd2b1a94',
        brand: 'Mercedes',
        model: 'E class',
        deleted: false
      },
      {
        id: '8e860a7d-e118-4e64-ba9d-0345e16994d0',
        brand: 'BMW',
        model: '3 series',
        deleted: false
      },
      {
        id: '0d2b13c0-181e-4faf-99ef-16e4b49e0c7e',
        brand: 'Fiat',
        model: 'Punto',
        deleted: false
      }
    ]);
  },

  async down (queryInterface, Sequelize) {}
};
