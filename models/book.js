'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Sequelize.Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Book.init({
    title: {
     type: Sequelize.STRING,
     allowNull: false,
     validate: {
      notNull: {
        msg: 'Please provide a title',
      },
      notEmpty: {
        msg: 'Please provide a title',
      },
     },
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a author',
        },
        notEmpty: {
          msg: 'Please provide a author',
        },
      },
    },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};