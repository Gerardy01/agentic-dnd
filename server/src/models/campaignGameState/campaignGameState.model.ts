import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Campaign from '@/models/campaign/campaign.model';
import POI from '@/models/poi/poi.model';

class CampaignGameState extends Model {
  declare public id: number;
  declare public campaign_id: number;
  declare public mode: string;
  declare public party_level: number;
  declare public short_rest_count: number;
  declare public in_game_time: string | null;
  declare public in_game_weather: string | null;
  declare public current_poi_id: number | null;
  declare public chapter_summary: string | null;
  declare public locations: any;
  declare public readonly updated_at: Date;
}

CampaignGameState.init(
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
      unique: true,
      references: {
        model: Campaign,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    mode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'narrative',
    },
    party_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    short_rest_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    in_game_time: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    in_game_weather: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    current_poi_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: POI,
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    chapter_summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    locations: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'CampaignGameState',
    tableName: 'campaign_game_states',
    timestamps: true,
    createdAt: false,
    underscored: true,
  }
);

export default CampaignGameState;
