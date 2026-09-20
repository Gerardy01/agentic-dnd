import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Campaign from '@/models/campaign/campaign.model';
import { ClassFeature, SpellcastingProperties } from '@/interfaces/IClass';

class ClassModel extends Model {
  declare public id: number;
  declare public campaign_id: number;
  declare public name: string;
  declare public description: string | null;
  declare public hit_die: number;
  declare public features: ClassFeature[];
  declare public spellcasting_properties: SpellcastingProperties | null;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

ClassModel.init(
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
    hit_die: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    features: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    spellcasting_properties: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Class',
    tableName: 'classes',
    timestamps: true,
    underscored: true,
  }
);

export default ClassModel;
