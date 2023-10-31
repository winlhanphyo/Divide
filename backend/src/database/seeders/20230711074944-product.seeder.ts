'use strict';

import { QueryInterface } from "sequelize";

import { DataBaseTableNames } from "../constants";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    return queryInterface.bulkInsert(DataBaseTableNames.PRODUCT,
      [
        {
          name: 'Product 1',
          description: "Description",
          price: 1000,
          categoryId: 1,
          quote: "quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo conse-",
          note: "m dolor sit amet, consectetuer Lorem ipsum dolor sit amet, consec- tetuer Lorem ipsum dolor sit amet, consectetuer m dolor sit amet, consec- tetuer Lorem ipsum.",
          createdUserId: 1,
          createdAt: '2023-07-11',
          updatedAt: '2023-07-11'
        },
        {
          name: 'NFT',
          description: "Description",
          price: 1000,
          categoryId: 1,
          quote: "quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo conse-",
          note: "m dolor sit amet, consectetuer Lorem ipsum dolor sit amet, consec- tetuer Lorem ipsum dolor sit amet, consectetuer m dolor sit amet, consec- tetuer Lorem ipsum.",
          createdUserId: 1,
          createdAt: '2023-07-11',
          updatedAt: '2023-07-11'
        },
        {
          name: 'Bass',
          description: "Description",
          price: 1000,
          categoryId: 1,
          quote: "quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo conse-",
          note: "m dolor sit amet, consectetuer Lorem ipsum dolor sit amet, consec- tetuer Lorem ipsum dolor sit amet, consectetuer m dolor sit amet, consec- tetuer Lorem ipsum.",
          createdUserId: 1,
          createdAt: '2023-07-11',
          updatedAt: '2023-07-11'
        }
      ], {});
  },

  down: (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete(DataBaseTableNames.PRODUCT, {}, {});
  }
};
