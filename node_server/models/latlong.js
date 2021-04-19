'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LatLong extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      LatLong.belongsTo(models.Route, {
        foreignKey: 'route_id'
      })
    }
  };
  LatLong.init({
    lat: DataTypes.FLOAT,
    long: DataTypes.FLOAT,
    route_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LatLong',
  });
  return LatLong;
};