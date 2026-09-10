'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spells', {
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
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      range: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      school: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      attack_properties: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      spell_save_properties: {
        type: Sequelize.JSONB,
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

    await queryInterface.addIndex('spells', ['campaign_id']);
    await queryInterface.addIndex('spells', ['level']);
    await queryInterface.addIndex('spells', ['school']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spells');
  },
};
