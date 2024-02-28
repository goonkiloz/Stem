'use strict';

let options = {};
options.tableName = 'Followings';

if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        followingId: 10
      },
      {
        userId: 2,
        followingId: 1
      },
      {
        userId: 3,
        followingId: 2
      },
      {
        userId: 4,
        followingId:3
      },
      {
        userId: 5,
        followingId: 4
      },
      {
        userId: 6,
        followingId: 5
      },
      {
        userId: 7,
        followingId: 6
      },
      {
        userId: 8,
        followingId: 7
      },
      {
        userId: 9,
        followingId: 8
      },
      {
        userId: 10,
        followingId: 9
      }
    ])
  },


  down: async (queryInterface, Sequelize) => {
    options.tableName = "Followings";
    return queryInterface.bulkDelete(options, null, {})
  }
};
