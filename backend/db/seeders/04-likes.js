'use strict';

let options = {};
options.tableName = 'Likes';

if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        postId: 10
      },
      {
        userId: 2,
        postId: 9
      },
      {
        userId: 1,
        postId: 8
      },
      {
        userId: 4,
        postId: 7
      },
      {
        userId: 5,
        postId: 6
      },
      {
        userId: 6,
        postId: 5
      },
      {
        userId: 7,
        postId: 4
      },
      {
        userId: 8,
        postId: 3
      },
      {
        userId: 9,
        postId: 2
      },
      {
        userId: 10,
        postId: 1
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Likes";
    return queryInterface.bulkDelete(options, null, {})
  }
};
