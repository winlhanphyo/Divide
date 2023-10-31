'use strict';

import { QueryInterface } from "sequelize";
import { DataBaseTableNames } from "../constants";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface, Sequelize: any) {
     return queryInterface.bulkInsert(DataBaseTableNames.CATEGORY,
      [
        {
          name: 'Original Art',
          createdUserId: 1,
          createdAt: '2023-07-11',
          updatedAt: '2023-07-11'
        },
        {
          name: 'Archieve',
          createdUserId: 1,
          createdAt: '2023-07-11',
          updatedAt: '2023-07-11'
        },
        {
          name: 'Gifts',
          createdUserId: 1,
          createdAt: '2023-07-11',
          updatedAt: '2023-07-11'
        },
        {
          name: 'Apparel',
          createdUserId: 1,
          createdAt: '2023-07-11',
          updatedAt: '2023-07-11'
        },
      ], {});

  },

  down: (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete(DataBaseTableNames.CATEGORY, {}, {});
  }
};
