'use strict';
const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Model {
    static associate(models) {

    }
  }
  Book.init({
    title: {
     type: DataTypes.STRING,
     allowNull: false,
     validate: {
      notNull: {
        msg: 'Title is required',
      },
      notEmpty: {
        msg: 'Title is required',
      },
     },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Author is required',
        },
        notEmpty: {
          msg: 'Author is required',
        },
      },
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};