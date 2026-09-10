import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Campaign from '@/models/campaign/campaign.model';

class Spell extends Model {
  declare public id: number;
  declare public campaign_id: number;
  declare public name: string;
  declare public description: string | null;
  declare public level: number;
  declare public range: string | null;
  declare public school: string | null;
  declare public attack_properties: any;
  declare public spell_save_properties: any;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

Spell.init(
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
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    range: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    school: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    attack_properties: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    spell_save_properties: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Spell',
    tableName: 'spells',
    timestamps: true,
    underscored: true,
  }
);

export default Spell;
