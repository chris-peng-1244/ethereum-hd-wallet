'use strict';
module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
        from: DataTypes.STRING,
        to: DataTypes.STRING,
        value: DataTypes.DECIMAL(23, 18),
        source: DataTypes.STRING,
        transactionType: DataTypes.STRING,
        transactionHash: DataTypes.STRING,
    }, {
        tableName: 'transactions',
    });
    Transaction.associate = function(models) {
        // associations can be defined here
    };
    return Transaction;
};
