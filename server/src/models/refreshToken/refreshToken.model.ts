import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import Account from '@/models/account/account.model';

class RefreshToken extends Model {
  declare public id: number;
  declare public account_id: string;
  declare public token_expiry_date: Date;
  declare public user_agent: string | null;
  declare public is_revoked: boolean;
  declare public identifier: string;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

RefreshToken.init(
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
    token_expiry_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_revoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    identifier: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refresh_tokens',
    timestamps: true,
    underscored: true,
  }
);

export default RefreshToken;
