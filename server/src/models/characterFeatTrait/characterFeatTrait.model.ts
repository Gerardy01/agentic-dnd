import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Character from '@/models/character/character.model';

class CharacterFeatTrait extends Model {
  declare public id: number;
  declare public character_id: number;
  declare public name: string;
  declare public description: string | null;
  declare public source: string;
  declare public source_name: string | null;
  declare public level: number | null;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

CharacterFeatTrait.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    character_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Character,
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
    source: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    source_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'CharacterFeatTrait',
    tableName: 'character_feat_traits',
    timestamps: true,
    underscored: true,
  }
);

export default CharacterFeatTrait;
