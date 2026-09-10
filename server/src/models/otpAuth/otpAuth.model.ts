import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';

class OtpAuth extends Model {
  declare public id: number;
  declare public code: number;
  declare public send_to: string;
  declare public expires_at: Date;
  declare public revoked: boolean;
  declare public readonly created_at: Date;
  declare public readonly updated_at: Date;
}

OtpAuth.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    send_to: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'OtpAuth',
    tableName: 'otp_auths',
    timestamps: true,
    underscored: true,
  }
);

export default OtpAuth;
