'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('npcs', {
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
      alignment: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      appearance: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      personality: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      backstory: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      mannerism: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      memory: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      npc_relationship: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      player_relationship: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      is_companion: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    await queryInterface.addIndex('npcs', ['campaign_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('npcs');
  },
};
