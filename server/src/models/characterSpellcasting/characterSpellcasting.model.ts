import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Character from '@/models/character/character.model';

class CharacterSpellcasting extends Model {
  declare public id: number;
  declare public character_id: number;
  declare public max_cantrip: number;
  declare public max_spell: number;
  declare public spell_slots: any;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

CharacterSpellcasting.init(
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
      unique: true,
      references: {
        model: Character,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    max_cantrip: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    max_spell: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    spell_slots: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'CharacterSpellcasting',
    tableName: 'character_spellcasting',
    timestamps: true,
    underscored: true,
  }
);

export default CharacterSpellcasting;
