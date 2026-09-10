import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Campaign from '@/models/campaign/campaign.model';

class Race extends Model {
  declare public id: number;
  declare public campaign_id: number;
  declare public name: string;
  declare public description: string | null;
  declare public speed: number;
  declare public languages: any;
  declare public traits: any;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

Race.init(
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
    speed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    languages: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    traits: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'Race',
    tableName: 'races',
    timestamps: true,
    underscored: true,
  }
);

export default Race;
