import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import NPC from '@/models/npc/npc.model';
import { NpcStat, NpcAction } from '@/interfaces/INpc';

class NPCCombatProfile extends Model {
  declare public id: number;
  declare public npc_id: number;
  declare public ac: number;
  declare public max_hp: number;
  declare public hp: number;
  declare public stat: NpcStat;
  declare public speed: number;
  declare public actions: NpcAction[];
  declare public cr_equivalent: number | null;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

NPCCombatProfile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    npc_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: NPC,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    ac: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_hp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stat: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    speed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    actions: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    cr_equivalent: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'NPCCombatProfile',
    tableName: 'npc_combat_profiles',
    timestamps: true,
    underscored: true,
  }
);

export default NPCCombatProfile;
