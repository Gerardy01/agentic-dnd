import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Campaign from '@/models/campaign/campaign.model';
import NPC from '@/models/npc/npc.model';
import POI from '@/models/poi/poi.model';

class Quest extends Model {
  declare public id: number;
  declare public campaign_id: number;
  declare public name: string;
  declare public description: string | null;
  declare public gm_instruction: string | null;
  declare public quest_giver: number | null;
  declare public quest_location: number | null;
  declare public quest_difficulty: string | null;
  declare public quest_tag: string | null;
  declare public quest_prerequisites: any;
  declare public status: string;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

Quest.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gm_instruction: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    quest_giver: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: NPC,
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    quest_location: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: POI,
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    quest_difficulty: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    quest_tag: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    quest_prerequisites: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'open',
    },
  },
  {
    sequelize,
    modelName: 'Quest',
    tableName: 'quests',
    timestamps: true,
    underscored: true,
  }
);

export default Quest;
