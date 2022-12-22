"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Posts", [
      {
        postId: 1,
        title: "테스트우먼이 작성한 첫번째 글입니다.",
        content: "냉무",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 2,
      },
      {
        postId: 2,
        title: "테스트맨이 작성한 두번째 글입니다.",
        content: "냉무",
        createdAt: new Date(Date.now() + 1000),
        updatedAt: new Date(Date.now() + 1000),
        userId: 1,
      },
    ]);
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Posts", null, {});
  },
};
