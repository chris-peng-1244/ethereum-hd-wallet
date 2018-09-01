'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('accounts', 'balance', {
      type: Sequelize.BIGINT,
        defaultValue: 0
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('accounts', 'balance');
  }
};
