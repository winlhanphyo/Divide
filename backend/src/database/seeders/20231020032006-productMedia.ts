'use strict';

import { QueryInterface } from "sequelize";
import { DataBaseTableNames } from "../constants";


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface, Sequelize: any) {
    return queryInterface.bulkInsert(DataBaseTableNames.PRODUCT_MEDIA,
      [
        {
          productId: 1,
          mediaId: 1,
          createdAt: '2023-07-12',
          updatedAt: '2023-07-12'
        },
        {
          productId: 1,
          mediaId: 2,
          createdAt: '2023-07-12',
          updatedAt: '2023-07-12'
        },
        {
          productId: 1,
          mediaId: 3,
          createdAt: '2023-07-12',
          updatedAt: '2023-07-12'
        },
      ], {});
  },
  down: (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete(DataBaseTableNames.PRODUCT_MEDIA, {}, {});
  }
};
