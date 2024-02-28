'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dislike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Dislike.belongsTo(
        models.User,
        {foreignKey: 'userId'}
      )
      Dislike.belongsTo(
        models.Post,
        {foreignKey: 'postId'}
      )
    }
  }
  Dislike.init({
    userId: {
      type: DataTypes.INTEGER,
    },
    postId: {
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'Dislike',
  });
  return Dislike;
};
