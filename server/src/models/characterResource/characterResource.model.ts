import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Character from '@/models/character/character.model';

class CharacterResource extends Model {
  declare public id: number;
  declare public character_id: number;
  declare public name: string;
  declare public source: string;
  declare public max: number;
  declare public current_value: number;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

CharacterResource.init(
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
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    max: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    current_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'CharacterResource',
    tableName: 'character_resources',
    timestamps: true,
    underscored: true,
  }
);

export default CharacterResource;
