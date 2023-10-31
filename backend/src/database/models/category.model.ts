import { DataTypes, Model, ModelAttributes } from "sequelize";
import { associative } from './associate.decorator';
import { DataBaseTableNames, DataBaseModelNames } from "../constants";
import { DbModelFieldInit } from "../db-structure.model";
import { db } from '../db.provider';

export interface ICategoryModel {
  id: number;
  name: string;
  createdUserId: number;
  updatedUserId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

const modelAttributes: DbModelFieldInit<Partial<ICategoryModel>> = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id'
    }
  },
  updatedUserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'user',
      key: 'id'
    }
  },
};
@associative
export class CategoryDbModel extends Model {
  static associate({
    UserDbModel
  }: any) {
    // this.belongsTo(UserDbModel);
    this.belongsTo(UserDbModel, { foreignKey: 'createdUserId', as: 'createdCategoryByUser', targetKey: 'id' });
    this.belongsTo(UserDbModel, { foreignKey: 'updatedUserId', as: 'updatedCategoryByUser', targetKey: 'id' });
  }
}

CategoryDbModel.init(modelAttributes as ModelAttributes, {
  sequelize: db,
  modelName: DataBaseModelNames.CATEGORY,
  tableName: DataBaseTableNames.CATEGORY,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  timestamps: true
});