'use strict';

let options = {};
options.tableName = 'Dislikes';

if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        postId: 3
      },
      {
        userId: 2,
        postId: 4
      },
      {
        userId: 3,
        postId: 5
      },
      {
        userId: 4,
        postId: 6
      },
      {
        userId: 5,
        postId: 7
      },
      {
        userId: 6,
        postId: 8
      },
      {
        userId: 7,
        postId: 9
      },
      {
        userId: 8,
        postId: 10
      },
      {
        userId: 9,
        postId: 1
      },
      {
        userId: 10,
        postId: 2
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Dislikes";
    return queryInterface.bulkDelete(options, null, {})
  }
};
