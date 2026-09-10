import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Character from '@/models/character/character.model';

class CharacterEffectModifier extends Model {
  declare public id: number;
  declare public character_id: number;
  declare public type: string;
  declare public effect: string;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

CharacterEffectModifier.init(
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
    type: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    effect: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'CharacterEffectModifier',
    tableName: 'character_effect_modifiers',
    timestamps: true,
    underscored: true,
  }
);

export default CharacterEffectModifier;
