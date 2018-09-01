'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('transactions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            from: {
                type: Sequelize.STRING
            },
            to: {
                type: Sequelize.STRING
            },
            valueInWei: {
                type: Sequelize.BIGINT
            },
            source: {
                type: Sequelize.STRING
            },
            transactionHash: {
                type: Sequelize.STRING
            },
            transactionType: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        })
            .then(() => {
                queryInterface.addIndex('transactions', {
                    fields: ['from'],
                })
            })
            .then(() => {
                queryInterface.addIndex('transactions', {
                    fields: ['to'],
                })
            });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Transactions');
    }
};
