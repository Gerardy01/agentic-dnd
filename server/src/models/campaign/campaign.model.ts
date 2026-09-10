import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Account from '@/models/account/account.model';

class Campaign extends Model {
  declare public id: number;
  declare public account_id: string;
  declare public name: string;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

Campaign.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    account_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Account,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Campaign',
    tableName: 'campaigns',
    timestamps: true,
    underscored: true,
  }
);

export default Campaign;
