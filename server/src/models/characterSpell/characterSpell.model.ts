import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Character from '@/models/character/character.model';
import Spell from '@/models/spell/spell.model';

class CharacterSpell extends Model {
  declare public id: number;
  declare public character_id: number;
  declare public spell_id: number;
  declare public is_prepared: boolean;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

CharacterSpell.init(
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
    spell_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Spell,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    is_prepared: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'CharacterSpell',
    tableName: 'character_spells',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['character_id', 'spell_id'],
      },
    ],
  }
);

export default CharacterSpell;
