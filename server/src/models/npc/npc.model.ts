import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Campaign from '@/models/campaign/campaign.model';

class NPC extends Model {
  declare public id: number;
  declare public campaign_id: number;
  declare public name: string;
  declare public alignment: string | null;
  declare public appearance: string | null;
  declare public personality: string | null;
  declare public backstory: string | null;
  declare public mannerism: string | null;
  declare public memory: any;
  declare public npc_relationship: any;
  declare public player_relationship: any;
  declare public is_companion: boolean;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

NPC.init(
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    alignment: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    appearance: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    personality: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    backstory: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mannerism: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    memory: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    npc_relationship: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    player_relationship: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    is_companion: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'NPC',
    tableName: 'npcs',
    timestamps: true,
    underscored: true,
  }
);

export default NPC;
