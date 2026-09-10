import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Campaign from '@/models/campaign/campaign.model';

class Chapter extends Model {
  declare public id: number;
  declare public campaign_id: number;
  declare public chapter_number: number;
  declare public title: string | null;
  declare public narrative_summary: string | null;
  declare public player_decisions: any;
  declare public narrative_summary_embedding: any;
  declare public prev_chapter_id: number | null;
  declare public next_chapter_id: number | null;
  declare public related_npc: any;
  declare public related_monsters: any;
  declare public related_items: any;
  declare public related_pois: any;
  declare public related_factions: any;
  declare public related_quests: any;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

Chapter.init(
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
    chapter_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    narrative_summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    player_decisions: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    narrative_summary_embedding: {
      type: DataTypes.TEXT, // Raw vector storage or vector representation in Sequelize
      allowNull: true,
    },
    prev_chapter_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'chapters',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    next_chapter_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'chapters',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    related_npc: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    related_monsters: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    related_items: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    related_pois: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    related_factions: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    related_quests: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'Chapter',
    tableName: 'chapters',
    timestamps: true,
    underscored: true,
  }
);

export default Chapter;
