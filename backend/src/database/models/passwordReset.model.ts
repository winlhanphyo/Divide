import { DataTypes, Model, ModelAttributes } from "sequelize";
import { associative } from './associate.decorator';
import { DataBaseTableNames, DataBaseModelNames } from "../constants";
import { DbModelFieldInit } from "../db-structure.model";
import { db } from '../db.provider';

export interface IPasswordResetModel {
  id: number;
  email: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

const modelAttributes: DbModelFieldInit<Partial<IPasswordResetModel>> = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
};

@associative
export class PasswordResetDbModel extends Model {
  static associate({
  }: any) {
//     this.belongsTo(CategoryDbModel, { foreignKey: 'categoryId', as: 'category', targetKey: 'id' });
//     this.belongsTo(UserDbModel, { foreignKey: 'createdUserId', as: 'createdProductyByUser', targetKey: 'id' });
//     this.belongsTo(UserDbModel, { foreignKey: 'updatedUserId', as: 'updatedProductByUser', targetKey: 'id' });
  }
}

PasswordResetDbModel.init(modelAttributes as ModelAttributes, {
  sequelize: db,
  modelName: DataBaseModelNames.PASSWORD_RESET,
  tableName: DataBaseTableNames.PASSWORD_RESET,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  timestamps: true
});
