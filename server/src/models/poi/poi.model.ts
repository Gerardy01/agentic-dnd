import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Area from '@/models/area/area.model';

class POI extends Model {
  declare public id: number;
  declare public area_id: number;
  declare public name: string;
  declare public description: string | null;
  declare public descriptive_overview: string | null;
  declare public descriptive_location: string | null;
  declare public map: string | null;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

POI.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Area,
        key: 'id',
      },
      onDelete: 'CASCADE',
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
    map: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'POI',
    tableName: 'pois',
    timestamps: true,
    underscored: true,
  }
);

export default POI;
