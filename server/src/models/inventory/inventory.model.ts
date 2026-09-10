import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Character from '@/models/character/character.model';
import Item from '@/models/item/item.model';

class Inventory extends Model {
  declare public id: number;
  declare public character_id: number;
  declare public item_id: number;
  declare public count: number;
  declare public source: string | null;
  declare public equipped: boolean;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

Inventory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    character_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Character,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Item,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    source: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    equipped: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Inventory',
    tableName: 'inventories',
    timestamps: true,
    underscored: true,
  }
);

export default Inventory;
