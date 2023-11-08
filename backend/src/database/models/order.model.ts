import { DataTypes, Model, ModelAttributes } from "sequelize";
import { associative } from './associate.decorator';
import { DataBaseTableNames, DataBaseModelNames } from "../constants";
import { DbModelFieldInit } from "../db-structure.model";
import { db } from '../db.provider';

export interface IOrdertModel {
  id: number;
  customer: number;
  firstName: string;
  lastName: string;
  country: string;
  company: string;
  address: string;
  additionalInfo: string;
  city: string;
  postalCode: string;
  phone: string;
  status: string;
  totalAmount: string;
  orderDetailId: string;
  paymentDone: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const modelAttributes: DbModelFieldInit<Partial<IOrdertModel>> = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id'
    }
  },
  firstName: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  additionalInfo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('new','shipping', 'complete'),
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  orderDetailId: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: false
  },
  paymentDone: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
};

@associative
export class OrderDbModel extends Model {
  static associate({
    UserDbModel
  }: any) {
    this.belongsTo(UserDbModel, { foreignKey: 'customer', as: 'customerData', targetKey: 'id' });
  }
}

OrderDbModel.init(modelAttributes as ModelAttributes, {
  sequelize: db,
  modelName: DataBaseModelNames.ORDER,
  tableName: DataBaseTableNames.ORDER,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  timestamps: true
});
