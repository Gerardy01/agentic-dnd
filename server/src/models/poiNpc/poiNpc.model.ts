import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import POI from '@/models/poi/poi.model';
import NPC from '@/models/npc/npc.model';

class POINPC extends Model {
  declare public id: number;
  declare public poi_id: number;
  declare public npc_id: number;
  declare public position: string | null;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

POINPC.init(
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
    npc_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: NPC,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    position: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'POINPC',
    tableName: 'poi_npcs',
    timestamps: true,
    underscored: true,
  }
);

export default POINPC;
