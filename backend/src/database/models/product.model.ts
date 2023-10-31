import { DataTypes, Model, ModelAttributes } from "sequelize";
import { associative } from './associate.decorator';
import { DataBaseTableNames, DataBaseModelNames } from "../constants";
import { DbModelFieldInit } from "../db-structure.model";
import { db } from '../db.provider';

export interface IProductModel {
  id: number;
  name: string;
  description: string;
  price: number;
  quote: string;
  note: string;
  categoryId: number;
  status: string;
  createdUserId: number;
  updatedUserId: number;
  createdAt: Date;
  updatedAt: Date;
}

const modelAttributes: DbModelFieldInit<Partial<IProductModel>> = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 1
  },
  quote: {
    type: DataTypes.STRING,
    allowNull: false
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'category',
      key: 'id'
    }
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
export class ProductDbModel extends Model {
  static associate({
    CategoryDbModel,
    UserDbModel,
    MediaDbModel,
    ProductMediaDbModel
  }: any) {
    this.belongsTo(CategoryDbModel, { foreignKey: 'categoryId', as: 'category', targetKey: 'id' });
    this.belongsToMany(MediaDbModel, { through: ProductMediaDbModel, as: 'media', foreignKey: 'productId' });
    this.belongsTo(UserDbModel, { foreignKey: 'createdUserId', as: 'createdProductyByUser', targetKey: 'id' });
    this.belongsTo(UserDbModel, { foreignKey: 'updatedUserId', as: 'updatedProductByUser', targetKey: 'id' });
  }
}

ProductDbModel.init(modelAttributes as ModelAttributes, {
  sequelize: db,
  modelName: DataBaseModelNames.PRODUCT,
  tableName: DataBaseTableNames.PRODUCT,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  timestamps: true
});
