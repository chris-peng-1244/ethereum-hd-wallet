'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('accounts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER
            },
            address: {
                type: Sequelize.STRING(42)
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
            queryInterface.addIndex('accounts', {
                fields: ['userId'],
                unique: true,
            })
        })
        .then(() => {
            queryInterface.addIndex('accounts', {
                fields: ['address'],
                unique: true,
            })
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Accounts');
    }
};
