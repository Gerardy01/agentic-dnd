import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Map from '@/models/map/map.model';

class Area extends Model {
  declare public id: number;
  declare public map_id: number;
  declare public parent_area_id: number | null;
  declare public depth: number;
  declare public path: string | null;
  declare public level_type: string;
  declare public name: string;
  declare public description: string | null;
  declare public descriptive_overview: string | null;
  declare public descriptive_location: string | null;
  declare public factions: any;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

Area.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    map_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Map,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    parent_area_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'areas',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    depth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    path: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    level_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    descriptive_overview: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    descriptive_location: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    factions: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'Area',
    tableName: 'areas',
    timestamps: true,
    underscored: true,
  }
);

export default Area;
