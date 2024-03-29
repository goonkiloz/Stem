'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.hasMany(
        models.Comment,
        {foreignKey: 'postId'}
      )
      Post.hasMany(
        models.Like,
        {foreignKey: 'postId'}
      )
      Post.hasMany(
        models.Dislike,
        {foreignKey: 'postId'}
      )
      Post.hasMany(
        models.View,
        {foreignKey: 'postId'}
      )
      Post.belongsTo(
        models.User,
        {foreignKey: 'userId'}
      )
    }
  }
  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    filepath: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
