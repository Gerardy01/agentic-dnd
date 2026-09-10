import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import POI from '@/models/poi/poi.model';
import MonsterInstance from '@/models/monsterInstance/monsterInstance.model';

class POIMonsterInstance extends Model {
  declare public id: number;
  declare public poi_id: number;
  declare public monster_instance_id: number;
  declare public position: string | null;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

POIMonsterInstance.init(
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
    monster_instance_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: MonsterInstance,
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
    modelName: 'POIMonsterInstance',
    tableName: 'poi_monster_instances',
    timestamps: true,
    underscored: true,
  }
);

export default POIMonsterInstance;
