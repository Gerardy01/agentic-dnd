'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('campaign_game_states', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      campaign_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'campaigns',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      mode: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'narrative',
      },
      party_level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      short_rest_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      in_game_time: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      in_game_weather: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      current_poi_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'pois',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      chapter_summary: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      locations: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('campaign_game_states');
  },
};
