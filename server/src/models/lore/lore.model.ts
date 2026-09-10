import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Campaign from '@/models/campaign/campaign.model';

class Lore extends Model {
  declare public id: number;
  declare public campaign_id: number;
  declare public source_id: number;
  declare public source_type: string;
  declare public title: string;
  declare public content: string | null;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

Lore.init(
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
    source_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    source_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Lore',
    tableName: 'lore',
    timestamps: true,
    underscored: true,
  }
);

export default Lore;
