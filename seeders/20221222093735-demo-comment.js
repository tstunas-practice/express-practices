"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Comments", [
      {
        commentId: 1,
        content: "첫번째 글에 테스트맨이 남긴 댓글",
        createdAt: new Date(Date.now() + 2000),
        updatedAt: new Date(Date.now() + 2000),
        postId: 1,
        userId: 1,
      },
      {
        commentId: 2,
        content: "두번째 글에 테스트우먼이 남긴 댓글",
        createdAt: new Date(Date.now() + 3000),
        updatedAt: new Date(Date.now() + 3000),
        postId: 2,
        userId: 2,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Comments", null, {});
  },
};
