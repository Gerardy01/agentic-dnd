import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import World from '@/models/world/world.model';

class Map extends Model {
  declare public id: number;
  declare public world_id: number;
  declare public descriptive_overview: string | null;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

Map.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    world_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: World,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    descriptive_overview: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Map',
    tableName: 'maps',
    timestamps: true,
    underscored: true,
  }
);

export default Map;
