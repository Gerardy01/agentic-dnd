'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quests', {
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
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      gm_instruction: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      quest_giver: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'npcs',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      quest_location: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'pois',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      quest_difficulty: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      quest_tag: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      quest_prerequisites: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'open',
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

    await queryInterface.addIndex('quests', ['campaign_id']);
    await queryInterface.addIndex('quests', ['status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('quests');
  },
};
