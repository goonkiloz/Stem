'use strict';

let options = {};
options.tableName = 'Posts';

if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(options, [
      {
        title: 'FunnyVideo1',
        userId: 1,
        thumbnail: 'Image.url',
        description: 'This is the first test post'
      },
      {
        title: 'FunnyVideo2',
        userId: 2,
        thumbnail: 'Image.url',
        description: 'This is the second test post'
      },
      {
        title: 'FunnyVideo3',
        userId: 3,
        thumbnail: 'Image.url',
        description: 'This is the third test post'
      },
      {
        title: 'FunnyVideo4',
        userId: 4,
        thumbnail: 'Image.url',
        description: 'This is the fourth test post'
      },
      {
        title: 'FunnyVideo5',
        userId: 5,
        thumbnail: 'Image.url',
        description: 'This is the fifth test post'
      },
      {
        title: 'FunnyVideo6',
        userId: 6,
        thumbnail: 'Image.url',
        description: 'This is the sixth test post'
      },
      {
        title: 'FunnyVideo7',
        userId: 7,
        thumbnail: 'Image.url',
        description: 'This is the seventh test post'
      },
      {
        title: 'FunnyVideo8',
        userId: 8,
        thumbnail: 'Image.url',
        description: 'This is the eigth test post'
      },
      {
        title: 'FunnyVideo9',
        userId: 9,
        thumbnail: 'Image.url',
        description: 'This is the ninth test post'
      },
      {
        title: 'FunnyVideo10',
        userId: 10,
        thumbnail: 'Image.url',
        description: 'This is the last test post'
      },
    ], { validate: true})
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Posts";
    return queryInterface.bulkDelete(options, null, {})
  }
};
