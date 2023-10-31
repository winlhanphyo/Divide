'use strict';

import { QueryInterface } from "sequelize";
import { DataBaseTableNames } from "../constants";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    return queryInterface.bulkInsert(DataBaseTableNames.MEDIA,
      [
        {
          name: "media1",
          type: 'photo',
          url: 'upload/user/photo/1.png',
          status: "available",
          createdAt: '2023-07-12',
          updatedAt: '2023-07-12'
        },
        {
          name: "media2",
          type: 'photo',
          url: 'upload/user/photo/2.png',
          status: "available",
          createdAt: '2023-07-12',
          updatedAt: '2023-07-12'
        },
        {
          name: "media3",
          type: 'photo',
          url: 'upload/user/photo/3.png',
          status: "available",
          createdAt: '2023-07-12',
          updatedAt: '2023-07-12'
        }
      ], {});
  },

  down: (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete(DataBaseTableNames.MEDIA, {}, {});
  }
};
