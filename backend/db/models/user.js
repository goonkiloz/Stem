'use strict';
const {
  Model,
  Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(
        models.Post,
        {foreignKey: 'userId'}
      )
      User.hasMany(
        models.Comment,
        {foreignKey: 'userId'}
      )
      User.hasMany(
        models.Like,
        {foreignKey: 'userId'}
      )
      User.hasMany(
        models.Dislike,
        {foreignKey: 'userId'}
      )
      User.hasMany(
        models.View,
        {foreignKey: 'userId'}
      )
      User.hasMany(
        models.Follower,
        {foreignKey: 'userId'}
      )
      User.hasMany(
        models.Follower,
        {foreignKey: 'followerId'}
      )
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 30],
        notNull: {
          msg: "First Name is required"
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 30],
        notNull: {
          msg: "Last Name is required"
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "User with that username already exists"
      },
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error('Cannot be an email.');
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "User with that email already exists"
      },
      validate: {
        len: [3, 256]
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    },
    profileImg: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    }
  });
  return User;
};
