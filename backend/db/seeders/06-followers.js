'use strict';

let options = {};
options.tableName = 'Followers';

if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        followerId: 2
      },
      {
        userId: 2,
        followerId: 3
      },
      {
        userId: 3,
        followerId: 4
      },
      {
        userId: 4,
        followerId:5
      },
      {
        userId: 5,
        followerId: 6
      },
      {
        userId: 6,
        followerId: 7
      },
      {
        userId: 7,
        followerId: 8
      },
      {
        userId: 8,
        followerId: 9
      },
      {
        userId: 9,
        followerId: 10
      },
      {
        userId: 10,
        followerId: 1
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Followers";
    return queryInterface.bulkDelete(options, null, {})
  }
};
