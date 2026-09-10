'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('areas', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      map_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'maps',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      parent_area_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'areas',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      depth: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      path: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      level_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      descriptive_overview: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      descriptive_location: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      factions: {
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

    await queryInterface.addIndex('areas', ['map_id']);
    await queryInterface.addIndex('areas', ['parent_area_id']);
    await queryInterface.addIndex('areas', ['path']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('areas');
  },
};
