const express = require("express");
const hashUtil = require("../utils/hash");
const router = express.Router();
const { Op } = require("sequelize");
const db = require("../models");

/**
 * 댓글 목록 조회 API
 */
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    // TODO: 검증 로직
    const result = await db.Comment.findAll({
      where: {
        postId: {
          [Op.eq]: postId,
        },
      },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(result);
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "서버에 에러가 발생했습니다." });
  }
});

/**
 * 댓글 작성 API
 * - 댓글 내용을 비워둔 채 댓글 작성 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
 * - 댓글 내용을 입력하고 댓글 작성 API를 호출한 경우 작성한 댓글을 추가하기
 */
router.post("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    db.Comment.create({
      content,
      userId: 1,
      postId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return res.status(200).json({
      success: true,
      message: "댓글을 작성했습니다.",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "서버에 에러가 발생했습니다." });
  }
});

/**
 * 댓글 수정 API
 * - 댓글 내용을 비워둔 채 댓글 수정 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
 * - 댓글 내용을 입력하고 댓글 수정 API를 호출한 경우 작성한 댓글을 수정하기
 */
router.put("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { password, content } = req.body;

    const comment = await db.Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "해당하는 댓글이 없습니다.",
      });
    }
    if (!(await hashUtil.comparePassword(password, comment.password))) {
      return res.status(401).json({
        success: false,
        message: "패스워드가 일치하지 않습니다.",
      });
    }
    await comment.update({ content: content });
    await comment.save();
    return res.status(200).json({
      success: true,
      message: "댓글을 수정했습니다.",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "서버에 에러가 발생했습니다." });
  }
});
/**
 * 댓글 삭제 API
 * 비밀번호를 넘겨줄 방법이 없어서 post로 대신
 */
router.post("/delete/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { password } = req.body;

    const comment = await db.Comment.findByPK(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "해당하는 댓글이 없습니다.",
      });
    }
    if (!(await hashUtil.comparePassword(password, comment.password))) {
      return res.status(401).json({
        success: false,
        message: "패스워드가 일치하지 않습니다.",
      });
    }
    await comment.destroy();
    await comment.save();
    return res.status(200).json({
      success: true,
      message: "댓글을 삭제했습니다.",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "서버에 에러가 발생했습니다." });
  }
});

module.exports = router;
