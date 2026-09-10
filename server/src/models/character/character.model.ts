import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Campaign from '@/models/campaign/campaign.model';
import Race from '@/models/race/race.model';
import ClassModel from '@/models/class/class.model';

class Character extends Model {
  declare public id: number;
  declare public campaign_id: number;
  declare public name: string;
  declare public level: number;
  declare public race_id: number | null;
  declare public class_id: number | null;
  declare public alignment: string | null;
  declare public max_hp: number;
  declare public hp: number;
  declare public ac: number;
  declare public speed: number;
  declare public stat: any;
  declare public skills: any;
  declare public balance: number;
  declare public languages: any;
  declare public appearance: string | null;
  declare public personality: string | null;
  declare public backstory: string | null;
  declare public mannerism: string | null;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

Character.init(
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
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    race_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Race,
        key: 'id',
      },
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ClassModel,
        key: 'id',
      },
    },
    alignment: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    max_hp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ac: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    speed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    stat: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    skills: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    languages: {
      type: DataTypes.JSONB,
      defaultValue: [],
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
  },
  {
    sequelize,
    modelName: 'Character',
    tableName: 'characters',
    timestamps: true,
    underscored: true,
  }
);

export default Character;
