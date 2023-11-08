import { DataTypes, Model, ModelAttributes } from "sequelize";
import { associative } from './associate.decorator';
import { DataBaseTableNames, DataBaseModelNames } from "../constants";
import { DbModelFieldInit } from "../db-structure.model";
import { db } from '../db.provider';

export interface IOrderModel {
  id: number;
  mediaId: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const modelAttributes: DbModelFieldInit<Partial<IOrderModel>> = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mediaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'media',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false
  }
};

@associative
export class OrderDetailDbModel extends Model {
  static associate({
    MediaDbModel
  }: any) {
    this.belongsTo(MediaDbModel, { foreignKey: 'mediaId', as: 'mediaData', targetKey: 'id' });
  }
}

OrderDetailDbModel.init(modelAttributes as ModelAttributes, {
  sequelize: db,
  modelName: DataBaseModelNames.ORDER_DETAIL,
  tableName: DataBaseTableNames.ORDER_DETAIL,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  timestamps: true
});
