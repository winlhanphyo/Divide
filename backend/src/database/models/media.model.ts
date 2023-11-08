import { DataTypes, Model, ModelAttributes } from "sequelize";
import { associative } from './associate.decorator';
import { DataBaseTableNames, DataBaseModelNames } from "../constants";
import { DbModelFieldInit } from "../db-structure.model";
import { db } from '../db.provider';

export interface IMediaModel {
  id: number;
  name: string;
  type: string;
  url: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const modelAttributes: DbModelFieldInit<Partial<IMediaModel>> = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('photo','video', 'music', 'text'),
    allowNull: false
  },
  url: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('available', 'not available'),
    allowNull: false,
    defaultValue: 'available'
  },
};

@associative
export class MediaDbModel extends Model {
  static associate({
    ProductMediaDbModel,
    ProductDbModel,
    OrderDetailDbModel
  }: any) {
    this.belongsToMany(ProductDbModel, { through: ProductMediaDbModel, as: 'products', foreignKey: 'mediaId' });
    this.hasMany(OrderDetailDbModel, { foreignKey: 'mediaId', as: 'mediaData' });
    // this.hasMany(OrderDetailDbModel, { foreignKey: 'mediaId', as: 'media' });
  }
}

MediaDbModel.init(modelAttributes as ModelAttributes, {
  sequelize: db,
  modelName: DataBaseModelNames.MEDIA,
  tableName: DataBaseTableNames.MEDIA,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  timestamps: true
});
