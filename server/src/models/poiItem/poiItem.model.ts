import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import POI from '@/models/poi/poi.model';
import Item from '@/models/item/item.model';

class POIItem extends Model {
  declare public id: number;
  declare public poi_id: number;
  declare public item_id: number;
  declare public count: number;
  declare public is_hidden: boolean;
  declare public container: string | null;
  declare public position: string | null;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

POIItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    poi_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: POI,
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
    is_hidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    container: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'POIItem',
    tableName: 'poi_items',
    timestamps: true,
    underscored: true,
  }
);

export default POIItem;
