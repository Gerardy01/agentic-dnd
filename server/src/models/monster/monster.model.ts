import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Campaign from '@/models/campaign/campaign.model';

class Monster extends Model {
  declare public id: number;
  declare public campaign_id: number;
  declare public name: string;
  declare public description: string | null;
  declare public appearance: string | null;
  declare public languages: any;
  declare public alignment: string | null;
  declare public size: string | null;
  declare public type: string | null;
  declare public min_hp: number;
  declare public max_hp: number;
  declare public ac: number;
  declare public cr: number;
  declare public stat: any;
  declare public speed: any;
  declare public senses: any;
  declare public additional_properties: any;
  declare public actions: any;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

Monster.init(
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
    appearance: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    languages: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    alignment: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    size: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    min_hp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_hp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ac: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cr: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
    },
    stat: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    speed: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    senses: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    additional_properties: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    actions: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'Monster',
    tableName: 'monsters',
    timestamps: true,
    underscored: true,
  }
);

export default Monster;
