'use strict';

let options = {};
options.tableName = 'Comments';

if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
up: async (queryInterface, Sequelize) => {
  return queryInterface.bulkInsert(options, [
    {
      userId: 1,
      postId: 1,
      comment: 'this is a funny video1'
    },
    {
      userId: 2,
      postId: 2,
      comment: 'this is a funny video2'
    },
    {
      userId: 3,
      postId: 3,
      comment: 'this is a funny video3'
    },
    {
      userId: 4,
      postId: 4,
      comment: 'this is a funny video4'
    },
    {
      userId: 5,
      postId: 5,
      comment: 'this is a funny video5'
    },
    {
      userId: 6,
      postId: 6,
      comment: 'this is a funny video6'
    },
    {
      userId: 7,
      postId: 7,
      comment: 'this is a funny video7'
    },
    {
      userId: 8,
      postId: 8,
      comment: 'this is a funny video8'
    },
    {
      userId: 9,
      postId: 9,
      comment: 'this is a funny video9'
    },
    {
      userId: 10,
      postId: 10,
      comment: 'this is a funny video10'
    }
  ], { validate: true})
  },

down: async (queryInterface, Sequelize) => {
  options.tableName = "Comments";
  return queryInterface.bulkDelete(options, null, {})
  }
};
