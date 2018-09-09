'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    ethereumAddress: DataTypes.STRING,
    balance: DataTypes.DECIMAL(23, 18),
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
