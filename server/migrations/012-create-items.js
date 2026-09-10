'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('items', {
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
      slug: {
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
      type: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      rarity: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      equip_slot: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      cost: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      weight: {
        type: Sequelize.DECIMAL(6, 2),
        defaultValue: 0,
      },
      weapon_properties: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      armor_properties: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      flat_bonus: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      override_bonus: {
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

    await queryInterface.addIndex('items', ['campaign_id', 'slug'], {
      unique: true,
    });
    await queryInterface.addIndex('items', ['campaign_id']);
    await queryInterface.addIndex('items', ['type']);
    await queryInterface.addIndex('items', ['rarity']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('items');
  },
};
