"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        userId: 1,
        nickname: "테스트맨",
        password:
          "$2a$10$pBoqSv8rXOcrdQYZF0mlMO8WNPnAMo3HAkAk.MUR7yKBZxuuMDF3.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        nickname: "테스트우먼",
        password:
          "$2a$10$pBoqSv8rXOcrdQYZF0mlMO8WNPnAMo3HAkAk.MUR7yKBZxuuMDF3.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
