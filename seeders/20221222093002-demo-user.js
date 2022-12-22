"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        userId: 1,
        nickname: "testman",
        password:
          "$2a$10$pBoqSv8rXOcrdQYZF0mlMO8WNPnAMo3HAkAk.MUR7yKBZxuuMDF3.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        nickname: "testwoman",
        password:
          "$2a$10$pBoqSv8rXOcrdQYZF0mlMO8WNPnAMo3HAkAk.MUR7yKBZxuuMDF3.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
