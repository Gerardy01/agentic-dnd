import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Character from '@/models/character/character.model';

class CharacterStatModifier extends Model {
  declare public id: number;
  declare public character_id: number;
  declare public modifier: string;
  declare public value: number;
  declare public ttl: number | null;
  declare public source: string;
  declare public source_slug: string | null;
  declare public type: string;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

CharacterStatModifier.init(
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
    modifier: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ttl: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    source_slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'CharacterStatModifier',
    tableName: 'character_stat_modifiers',
    timestamps: true,
    underscored: true,
  }
);

export default CharacterStatModifier;
