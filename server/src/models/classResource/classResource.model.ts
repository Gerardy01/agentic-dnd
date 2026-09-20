import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import ClassModel from '@/models/class/class.model';
import { ResourceMaxPerLevel, ResourceRecovery } from '@/interfaces/IClass';

class ClassResource extends Model {
  declare public id: number;
  declare public class_id: number;
  declare public name: string;
  declare public description: string | null;
  declare public max_per_level: ResourceMaxPerLevel[];
  declare public resource_recovery: ResourceRecovery | null;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

ClassResource.init(
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    max_per_level: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    resource_recovery: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ClassResource',
    tableName: 'class_resources',
    timestamps: true,
    underscored: true,
  }
);

export default ClassResource;
