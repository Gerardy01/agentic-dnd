'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('poi_npcs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      poi_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pois',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      npc_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'npcs',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      position: {
        type: Sequelize.STRING(255),
        allowNull: true,
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

    await queryInterface.addIndex('poi_npcs', ['poi_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('poi_npcs');
  },
};
