'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('npcs', 'race_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'races',
        key: 'id',
      },
      onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('npcs', ['race_id']);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('npcs', 'race_id');
  },
};
