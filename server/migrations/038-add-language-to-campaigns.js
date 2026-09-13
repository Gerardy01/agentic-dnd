'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('campaigns', 'language', {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'en',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('campaigns', 'language');
  },
};
