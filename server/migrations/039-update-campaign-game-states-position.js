'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('campaign_game_states', 'locations', 'position');
    await queryInterface.changeColumn('campaign_game_states', 'position', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.changeColumn('campaign_game_states', 'short_rest_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 2,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('campaign_game_states', 'short_rest_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('campaign_game_states', 'position', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
    });
    await queryInterface.renameColumn('campaign_game_states', 'position', 'locations');
  },
};
