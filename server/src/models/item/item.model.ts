import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Campaign from '@/models/campaign/campaign.model';

class Item extends Model {
  declare public id: number;
  declare public campaign_id: number;
  declare public name: string;
  declare public slug: string;
  declare public description: string | null;
  declare public appearance: string | null;
  declare public type: string;
  declare public category: string | null;
  declare public rarity: string | null;
  declare public equip_slot: string | null;
  declare public cost: number;
  declare public weight: number;
  declare public weapon_properties: any;
  declare public armor_properties: any;
  declare public flat_bonus: any;
  declare public override_bonus: any;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

Item.init(
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
    slug: {
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
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    rarity: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    equip_slot: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    weight: {
      type: DataTypes.DECIMAL(6, 2),
      defaultValue: 0,
    },
    weapon_properties: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    armor_properties: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    flat_bonus: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    override_bonus: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Item',
    tableName: 'items',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['campaign_id', 'slug'],
      },
    ],
  }
);

export default Item;
