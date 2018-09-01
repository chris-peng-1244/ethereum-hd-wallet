'use strict';
module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
        from: DataTypes.STRING,
        to: DataTypes.STRING,
        valueInWei: DataTypes.BIGINT,
        source: DataTypes.STRING,
        transactionType: DataTypes.STRING,
        transactionHash: DataTypes.STRING,
    }, {});
    Transaction.associate = function(models) {
        // associations can be defined here
    };
    return Transaction;
};
