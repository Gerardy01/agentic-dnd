'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('characters', {
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
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      race_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'races',
          key: 'id',
        },
      },
      class_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'classes',
          key: 'id',
        },
      },
      alignment: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      max_hp: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      hp: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ac: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      speed: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 30,
      },
      stat: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      skills: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      languages: {
        type: Sequelize.JSONB,
        defaultValue: [],
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

    await queryInterface.addIndex('characters', ['campaign_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('characters');
  },
};
