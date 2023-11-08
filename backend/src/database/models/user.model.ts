import { DataTypes, Model, ModelAttributes } from "sequelize";
import { associative } from './associate.decorator';
import { DataBaseTableNames, DataBaseModelNames } from "../constants";
import { DbModelFieldInit } from "../db-structure.model";
import { db } from '../db.provider';
import { type } from "os";
export interface IUserModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  type: string;
  dob: string;
  address: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

const modelAttributes: DbModelFieldInit<Partial<IUserModel>> = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.ENUM('admin','user'),
    allowNull: false,
    defaultValue: 'user'
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  }
};
@associative
export class UserDbModel extends Model {
  static associate({ OrderDbModel, ProductDbModel }: any) {
    // this.belongsToMany(EventDbModel, { through: 'event_user' });
    // this.hasMany(EventDbModel, { foreignKey: 'createdUser', as: 'user' });
    // this.hasMany(CategoryDbModel);
    this.hasMany(OrderDbModel,  { foreignKey: 'customer', as: 'customerData' });
    // this.hasMany(ProductDbModel, { foreignKey: 'createdUserId', as: 'createdProductByUser' });
    // this.hasMany(ProductDbModel, { foreignKey: 'updatedUserId', as: 'updatedProductByUser' });
  }
}

UserDbModel.init(modelAttributes as ModelAttributes, {
  sequelize: db,
  modelName: DataBaseModelNames.USER,
  tableName: DataBaseTableNames.USER,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  timestamps: true
});
