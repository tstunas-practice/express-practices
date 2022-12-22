"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.User, {
        foreignKey: "userId",
        onUpdate: "CASCADE",
      });
      Comment.belongsTo(models.Post, {
        foreignKey: "postId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Comment.init(
    {
      commentId: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      userId: DataTypes.BIGINT,
      postId: DataTypes.BIGINT,
      content: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
