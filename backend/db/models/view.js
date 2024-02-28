'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class View extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      View.belongsTo(
        models.User,
        {foreignKey: 'userId'}
      )
      View.belongsTo(
        models.Post,
        {foreignKey: 'postId'}
      )
    }
  }
  View.init({
    userId: {
      type: DataTypes.INTEGER,
    },
    postId: {
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'View',
  });
  return View;
};
