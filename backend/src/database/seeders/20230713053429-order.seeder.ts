'use strict';

import { QueryInterface } from "sequelize";
import { DataBaseTableNames } from "../constants";


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface, Sequelize: any) {
    return queryInterface.bulkInsert(DataBaseTableNames.ORDER,
      [
        {
          customer: 1,
          firstName: 'John',
          lastName: 'Doe',
          country: 'Singapore',
          company: 'Orion',
          address: 'No (3) River Valley Rd, Singapore',
          additionalInfo: 'No(35) St.John Street',
          city: 'Singapore',
          postalCode: '11231',
          phone: '+391234',
          status: 'new',
          totalAmount: 1000,
          orderDetailId: "[1]",
          paymentDone: true,
          createdAt: '2023-07-12',
          updatedAt: '2023-07-12'
        }
      ], {});
  },

  down: (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete(DataBaseTableNames.ORDER, {}, {});
  }
};
