'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('monsters', {
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
      appearance: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      languages: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      alignment: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      size: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      min_hp: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      max_hp: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ac: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      cr: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: false,
      },
      stat: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      speed: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      senses: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      additional_properties: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      actions: {
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

    await queryInterface.addIndex('monsters', ['campaign_id']);
    await queryInterface.addIndex('monsters', ['cr']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('monsters');
  },
};
