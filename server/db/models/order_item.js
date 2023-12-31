'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_item extends Model {
    static associate (models) {
      order_item.belongsTo(models.order, {
        foreignKey: 'orderId'
      });
      order_item.belongsTo(models.item, {
        foreignKey: 'itemId'
      });
    }
  }
  order_item.init({
    orderId: {
      primaryKey: true,
      type: DataTypes.UUID
    },
    itemId: {
      primaryKey: true,
      type: DataTypes.UUID
    },
    deliveryDate: DataTypes.STRING,
    status: DataTypes.STRING,
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'order_item'
  });
  return order_item;
};
