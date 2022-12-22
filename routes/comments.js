const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const db = require("../models");
const authMiddleware = require("../middleware/auth-middleware");

/**
 * 댓글 목록 조회 API
 */
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    // TODO: 검증 로직
    const data = await db.Comment.findAll({
      attributes: {
        include: ["User.nickname"],
        exclude: ["userId"],
      },
      where: {
        postId: {
          [Op.eq]: postId,
        },
      },
      include: [
        {
          model: db.User,
          attributes: [],
          as: "User",
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ data });
  } catch (e) {
    return res.status(400).json({ errorMessage: "댓글 조회에 실패했습니다." });
  }
});

/**
 * 댓글 작성 API
 * - 댓글 내용을 비워둔 채 댓글 작성 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
 * - 댓글 내용을 입력하고 댓글 작성 API를 호출한 경우 작성한 댓글을 추가하기
 */
router.post("/:postId", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    const { content } = req.body;

    db.Comment.create({
      content,
      userId,
      postId,
    });
    return res.status(201).json({
      message: "댓글을 작성했습니다.",
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ errorMessage: "댓글 작성에 실패했습니다." });
  }
});

/**
 * 댓글 수정 API
 * - 댓글 내용을 비워둔 채 댓글 수정 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
 * - 댓글 내용을 입력하고 댓글 수정 API를 호출한 경우 작성한 댓글을 수정하기
 */
router.put("/:commentId", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await db.Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "댓글이 존재하지 않습니다.",
      });
    }
    if (comment.userId !== userId) {
      return res.status(401).json({
        errorMessage: "권한이 없습니다.",
      });
    }
    await comment.update({ content, updatedAt: new Date() });
    await comment.save();
    return res.status(200).json({
      message: "댓글을 수정했습니다.",
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ errorMessage: "댓글 수정에 실패했습니다." });
  }
});
/**
 * 댓글 삭제 API
 */
router.delete("/:commentId", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { commentId } = req.params;

    const comment = await db.Comment.findByPK(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "댓글이 존재하지 않습니다.",
      });
    }
    if (comment.userId !== userId) {
      return res.status(401).json({
        errorMessage: "권한이 없습니다.",
      });
    }
    await comment.destroy();
    await comment.save();
    return res.status(200).json({
      message: "댓글을 삭제했습니다.",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ success: false, message: "댓글 수정에 실패했습니다." });
  }
});

module.exports = router;
