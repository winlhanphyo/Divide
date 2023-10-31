import { QueryInterface } from "sequelize";
import bcrypt, { compareSync } from "bcrypt";
import { DataBaseTableNames } from "../constants";

export default {
  up: async(queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkInsert(DataBaseTableNames.USER,
      [
        {
          firstName: 'James',
          lastName: 'Smith',
          email: 'jamessmith@gmail.com',
          password: await bcrypt.hash("password123", 12),
          type: "admin",
          dob: '1993-01-12',
          address: "Arena di Verona",
          phone: "+3912312",
          createdUserId: 1,
          createdAt: '2023-07-11',
          updatedAt: '2023-07-11'
        },
        {
          firstName: 'Rose',
          lastName: 'Mary',
          email: 'rosemary@gmail.com',
          password: await bcrypt.hash("password123", 12),
          type: "admin",
          dob: '1993-12-12',
          address: "Rock Rooms Inc",
          phone: "+3912312",
          createdUserId: 1,
          createdAt: '2023-07-11',
          updatedAt: '2023-07-11'
        },
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@gmail.com',
          password: await bcrypt.hash("password123", 12),
          type: "user",
          dob: '1993-05-12',
          address: "Wembley Stadium",
          phone: "+3912312",
          createdUserId: 1,
          createdAt: '2023-07-11',
          updatedAt: '2023-07-11'
        },
        {
          firstName: 'Merry',
          lastName: 'Jasmine',
          email: 'merryjasmine@gmail.com',
          password: await bcrypt.hash("password123", 12),
          type: "user",
          dob: '1993-12-09',
          address: "Wembley Stadium",
          phone: "+3912312",
          createdUserId: 1,
          createdAt: '2023-07-11',
          updatedAt: '2023-07-11'
        },
        {
          firstName: 'Sim',
          lastName: 'Mon',
          email: 'simmon@gmail.com',
          password: await bcrypt.hash("password123", 12),
          dob: '1995-01-12',
          type: "user",
          address: "Wembley Stadium",
          phone: "+3912312",
          createdUserId: 1,
          createdAt: '2023-07-11',
          updatedAt: '2023-07-11'
        },
        {
          firstName: 'Barry',
          lastName: 'Jane',
          email: 'barryjane@gmail.com',
          password: await bcrypt.hash("password123", 12),
          type: "user",
          dob: '1997-12-12',
          address: "Wembley Stadium",
          phone: "+3912312",
          createdUserId: 1,
          createdAt: '2023-07-11',
          updatedAt: '2023-07-11'
        },
        {
          firstName: 'Li',
          lastName: 'Li',
          email: 'lili@gmail.com',
          password: await bcrypt.hash("password123", 12),
          type: 1,
          dob: '1997-12-12',
          address: "Wembley Stadium",
          phone: "+3912312",
          createdUserId: 1,
          createdAt: '2023-07-11',
          updatedAt: '2023-07-11'
        },
      ], {});
  },
  down: (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete(DataBaseTableNames.USER, {}, {});
  }
}