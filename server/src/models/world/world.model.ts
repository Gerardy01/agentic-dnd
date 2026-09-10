import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Campaign from '@/models/campaign/campaign.model';

class World extends Model {
  declare public id: number;
  declare public campaign_id: number;
  declare public name: string;
  declare public description: string | null;
  declare public currency_name: string;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

World.init(
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    currency_name: {
      type: DataTypes.STRING(100),
      defaultValue: 'Gold',
    },
  },
  {
    sequelize,
    modelName: 'World',
    tableName: 'worlds',
    timestamps: true,
    underscored: true,
  }
);

export default World;
