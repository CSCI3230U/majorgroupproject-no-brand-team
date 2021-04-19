'use strict';
var bcrypt = require('bcrypt-nodejs');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        isEmail: { msg: 'Invalid email.' },
        msg: 'This email is already taken.',
      },
      unique: true,
      validate: {
        notNull: { msg: 'The email is required' },
      },
    },
    password: DataTypes.STRING,
    height: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  }, {
    defaultScope: {},
    scopes: {
      login: {},
    }
  });


  User.beforeSave((user, options) => {
    if (user.changed('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    }
  });
  User.prototype.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    });

  };
  User.associate = (models) => {
    User.hasMany(models.BloodPressure, {
      foreignKey: 'user_id'
    })
  }
  return User;
};