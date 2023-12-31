'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class manufacturer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  manufacturer.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID
    },
    brand: DataTypes.STRING,
    model: DataTypes.STRING,
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'manufacturer',
    timestamps: false
  });
  return manufacturer;
};
