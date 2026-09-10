import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import ClassModel from '@/models/class/class.model';
import Spell from '@/models/spell/spell.model';

class ClassSpell extends Model {
  declare public id: number;
  declare public class_id: number;
  declare public spell_id: number;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

ClassSpell.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ClassModel,
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
  },
  {
    sequelize,
    modelName: 'ClassSpell',
    tableName: 'class_spells',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['class_id', 'spell_id'],
      },
    ],
  }
);

export default ClassSpell;
