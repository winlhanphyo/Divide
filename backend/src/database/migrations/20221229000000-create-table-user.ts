'use strict';

import { DataTypes, ModelAttributes, QueryInterface, QueryOptions } from "sequelize";
import { DataBaseTableNames } from "../constants";
import { migrationWrapper } from "../transactions";

export default {
  up: async (queryInterface: QueryInterface, dataTypes: any) => {
    const migration = async (options: QueryOptions) => {
      await queryInterface.createTable(
        DataBaseTableNames.USER,
        {
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
            allowNull: false,
            unique: true
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          type: {
            type: DataTypes.ENUM('admin', 'user'),
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
          },
          createdUserId: {
            type: DataTypes.INTEGER,
            allowNull: true
          },
          updatedUserId: {
            type: DataTypes.INTEGER,
            allowNull: true
          },
          createdAt: {
            type: DataTypes.DATE
          },
          updatedAt: {
            type: DataTypes.DATE
          },
        } as ModelAttributes, options
      );
    };
    await migrationWrapper(migration);
  },
  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    const migration = async (options: QueryOptions) => {
      await queryInterface.dropTable(
        DataBaseTableNames.USER, options);
    };
    await migrationWrapper(migration);
  }
};