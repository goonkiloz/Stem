'use strict';

const {User, Sequelize} = require('../models');
const bcrypt = require('bcryptjs');


let options = {};
options.tableName = 'Users';

if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

module.exports = {


    up: async (queryInterface, Sequelize) => {
      options.tableName = "Users";
      return queryInterface.bulkInsert(options, [
        {
          email: 'demo@user.io',
          firstName: 'demo',
          lastName: 'user',
          username: 'Demo-lition',
          hashedPassword: bcrypt.hashSync('password')
        },
        {
          email: 'user1@user.io',
          firstName: 'random',
          lastName: 'user1',
          username: 'FakeUser1',
          hashedPassword: bcrypt.hashSync('password1')
        },
        {
          email: 'user2@user.io',
          firstName: 'random',
          lastName: 'user2',
          username: 'FakeUser2',
          hashedPassword: bcrypt.hashSync('password2')
        },
        {
          email: 'user3@user.io',
          firstName: 'random',
          lastName: 'user3',
          username: 'FakeUser3',
          hashedPassword: bcrypt.hashSync('password3')
        },
        {
          email: 'user4@user.io',
          firstName: 'random',
          lastName: 'user4',
          username: 'FakeUser4',
          hashedPassword: bcrypt.hashSync('password4')
        },
        {
          email: 'user5@user.io',
          firstName: 'random',
          lastName: 'user5',
          username: 'FakeUser5',
          hashedPassword: bcrypt.hashSync('password5')
        },
        {
          email: 'user6@user.io',
          firstName: 'random',
          lastName: 'user6',
          username: 'FakeUser6',
          hashedPassword: bcrypt.hashSync('password6')
        },
        {
          email: 'user7@user.io',
          firstName: 'random',
          lastName: 'user7',
          username: 'FakeUser7',
          hashedPassword: bcrypt.hashSync('password7')
        },
        {
          email: 'user8@user.io',
          firstName: 'random',
          lastName: 'user8',
          username: 'FakeUser8',
          hashedPassword: bcrypt.hashSync('password8')
        },
        {
          email: 'user9@user.io',
          firstName: 'random',
          lastName: 'user9',
          username: 'FakeUser9',
          hashedPassword: bcrypt.hashSync('password9')
        },
      ], {})
    },



    down: async (queryInterface, Sequelize) => {
      options.tableName = "Users";
      const Op = Sequelize.Op;
      return queryInterface.bulkDelete(options, {
        username: {[Op.in]: []}
      })
    }
  }
