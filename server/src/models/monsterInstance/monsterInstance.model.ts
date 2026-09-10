import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Campaign from '@/models/campaign/campaign.model';
import Monster from '@/models/monster/monster.model';

class MonsterInstance extends Model {
  declare public id: number;
  declare public campaign_id: number;
  declare public monster_id: number;
  declare public max_hp: number;
  declare public hp: number;
  declare public status: string;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

MonsterInstance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    campaign_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Campaign,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    monster_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Monster,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    max_hp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'alive',
    },
  },
  {
    sequelize,
    modelName: 'MonsterInstance',
    tableName: 'monster_instances',
    timestamps: true,
    underscored: true,
  }
);

export default MonsterInstance;
