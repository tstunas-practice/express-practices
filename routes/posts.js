const express = require("express");
const hashUtil = require("../utils/hash");
const router = express.Router();
const db = require("../models");

/**
 * 게시글 조회 API
 * - 제목, 작성자명, 작성 내용을 조회하기
 */
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const result = await db.Post.findByPk(postId);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "서버에 에러가 발생했습니다." });
  }
});

/**
 * 전체 게시글 목록 조회 API
 * - 제목, 작성자명, 작성 날짜를 조회하기
 * - 작성 날짜를 기준으로 내림차순 정렬하기
 */
router.get("/", async (req, res) => {
  try {
    const result = await db.Post.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "서버에 에러가 발생했습니다." });
  }
});

/**
 * 게시글 작성 API
 * - 제목, 작성자명, 비밀번호, 작성 내용을 입력하기
 */
router.post("/", async (req, res) => {
  console.log("ww");
  try {
    console.log("ww");
    const { title, author, password, content } = req.body;

    const passwordHash = await hashUtil.hashPassword(password);
    await db.Post.create({
      title: title,
      author: author,
      password: passwordHash,
      content: content,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      userId: 1,
    });
    return res.status(200).json({
      success: true,
      message: "게시글을 작성했습니다.",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "서버에 에러가 발생했습니다." });
  }
});

/**
 * 게시글 수정 API
 * - 입력된 비밀번호를 확인하여 수정
 */
router.put("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, author, password, content } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "비밀번호 입력이 필요합니다.",
      });
    }
    const post = await db.Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "해당하는 글이 없습니다.",
      });
    }
    if (!(await hashUtil.comparePassword(password, post.password))) {
      return res.status(401).json({
        success: false,
        message: "패스워드가 일치하지 않습니다.",
      });
    }
    await post.update({
      title: title || post.title,
      author: author || post.author,
      content: content,
    });
    await post.save();
    return res.status(200).json({
      success: true,
      message: "게시글을 업데이트했습니다.",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "서버에 에러가 발생했습니다." });
  }
});

/**
 * 게시글 삭제 API
 * - 입력된 비밀번호를 확인하여 삭제
 */
router.post("/delete/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await db.Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "해당하는 글이 없습니다.",
      });
    }
    const { password } = req.body;

    if (!(await hashUtil.comparePassword(password, post.password))) {
      return res.status(401).json({
        success: false,
        message: "패스워드가 일치하지 않습니다.",
      });
    }
    await post.destroy();
    await post.save();
    return res.status(200).json({
      success: true,
      message: "게시글을 삭제했습니다.",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "서버에 에러가 발생했습니다." });
  }
});

module.exports = router;
