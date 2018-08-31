'use strict';
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    userId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    balance: DataTypes.BIGINT,
  }, {});
  Account.associate = function(models) {
    // associations can be defined here
  };
  return Account;
};
