import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';

class Account extends Model {
  declare public id: string;
  declare public username: string;
  declare public email: string;
  declare public password: string;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

Account.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Account',
    tableName: 'accounts',
    timestamps: true,
    underscored: true,
  }
);

export default Account;
