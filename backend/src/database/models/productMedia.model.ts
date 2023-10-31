import { DataTypes, Model, ModelAttributes } from "sequelize";
import { associative } from './associate.decorator';
import { DataBaseTableNames, DataBaseModelNames } from "../constants";
import { DbModelFieldInit } from "../db-structure.model";
import { db } from '../db.provider';

export interface IProductMediaModel {
  id: number;
  productId: number;
  mediaId: number;
  createdAt: Date;
  updatedAt: Date;
}

const modelAttributes: DbModelFieldInit<Partial<IProductMediaModel>> = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'product',
      key: 'id'
    }
  },
  mediaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'media',
      key: 'id'
    }
  },
};

@associative
export class ProductMediaDbModel extends Model {
  static associate({
  }: any) {
//     this.belongsTo(CategoryDbModel, { foreignKey: 'categoryId', as: 'category', targetKey: 'id' });
//     this.belongsTo(UserDbModel, { foreignKey: 'createdUserId', as: 'createdProductyByUser', targetKey: 'id' });
//     this.belongsTo(UserDbModel, { foreignKey: 'updatedUserId', as: 'updatedProductByUser', targetKey: 'id' });
  }
}

ProductMediaDbModel.init(modelAttributes as ModelAttributes, {
  sequelize: db,
  modelName: DataBaseModelNames.PRODUCT_MEDIA,
  tableName: DataBaseTableNames.PRODUCT_MEDIA,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  timestamps: true
});
