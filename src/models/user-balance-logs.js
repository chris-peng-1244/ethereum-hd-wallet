'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('UserBalanceLog', {
        userId: DataTypes.INTEGER,
        type: DataTypes.STRING,
        value: DataTypes.DECIMAL(23, 18),
    }, {
        tableName: 'user-balance-logs',
    });
};
