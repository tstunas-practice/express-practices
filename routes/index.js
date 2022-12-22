const express = require("express");
const router = express.Router();
const postRoutes = require("./posts");
const commentRoutes = require("./comments");
const publicRoutes = require("./public");

router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/", publicRoutes);

module.exports = router;
