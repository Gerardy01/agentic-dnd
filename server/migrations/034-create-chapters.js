'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chapters', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      campaign_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'campaigns',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      chapter_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      narrative_summary: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      player_decisions: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      narrative_summary_embedding: {
        type: 'vector(1536)',
        allowNull: true,
      },
      prev_chapter_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'chapters',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      next_chapter_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'chapters',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      related_npc: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      related_monsters: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      related_items: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      related_pois: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      related_factions: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      related_quests: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addIndex('chapters', ['campaign_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('chapters');
  },
};
