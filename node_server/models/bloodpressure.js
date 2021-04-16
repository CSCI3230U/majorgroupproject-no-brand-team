'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BloodPressure extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  BloodPressure.init({
    pressure: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BloodPressure',
  });

  BloodPressure.associate = (models) => {
    BloodPressure.belongsTo(models.User, {
      foreignKey: 'user_id'
    })
  }
  return BloodPressure;
};