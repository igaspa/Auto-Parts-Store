'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('order', [
      {
        id: 'a1e679a5-f5a6-4070-8f3d-91ea156bcc1b',
        user_id: '20c1297e-58f6-4587-842b-231ff6583086',
        delivery_address: '4rd Blvd',
        item_list: [
          { id: 'f0d0ea4d-0e40-4987-866e-154da59552c5', quantity: 2 },
          { id: 'fff3cb51-f73a-4fbd-985f-e76054e1a9ea', quantity: 51 }
        ],
        currency: 'EUR',
        created_at: new Date(),
        updated_at: new Date(),
        deleted: false
      },
      {
        id: '5de49635-dbd9-4ecd-9705-53731f42033b',
        user_id: '805a10d7-1735-4a6c-a4cd-0be767aaeca1',
        delivery_address: '3rd Blvd',
        item_list: [
          { id: 'f0d0ea4d-0e40-4987-866e-154da59552c5', quantity: 5 },
          { id: 'fff3cb51-f73a-4fbd-985f-e76054e1a9ea', quantity: 50 }
        ],
        currency: 'USD',
        created_at: new Date(),
        updated_at: new Date(),
        deleted: false
      },
      {
        id: 'fdc0d18f-55f9-48be-b42e-9979da9d69f2',
        user_id: '805a10d7-1735-4a6c-a4cd-0be767aaeca1',
        delivery_address: '3rd Blvd',
        order_status: 'ready_for_pickup',
        item_list: [
          { id: 'f0d0ea4d-0e40-4987-866e-154da59552c5', quantity: 5 },
          { id: 'fff3cb51-f73a-4fbd-985f-e76054e1a9ea', quantity: 50 }
        ],
        currency: 'USD',
        created_at: new Date(),
        updated_at: new Date(),
        deleted: false
      }
    ], {}, { item_list: { type: new Sequelize.JSONB() } });
  },

  async down (queryInterface, Sequelize) {}
};