const express = require("express");
const router = express.Router();
const db = require("../models");
const authMiddleware = require("../middleware/auth-middleware");

/**
 * 게시글 조회 API
 * - 제목, 작성자명, 작성 내용을 조회하기
 */
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const data = await db.Post.findOne({
      raw: true,
      attributes: {
        include: ["User.nickname"],
        exclude: ["userId"],
      },
      where: {
        postId,
      },
      include: [
        {
          model: db.User,
          attributes: [],
          as: "User",
        },
      ],
    });
    res.status(200).json({ data });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ errorMessage: "게시글 조회에 실패했습니다." });
  }
});

router.get("/like", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;

    const data = await db.Like.findAll({
      raw: true,
      attributes: {
        include: ["Post.*"],
        exclude: ["userId"],
      },
      where: {
        userId,
      },
      include: [
        {
          model: db.Post,
          attributes: [],
          include: [db.User],
          as: "Post",
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ data });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ errorMessage: "좋아요 게시글 조회에 실패했습니다." });
  }
});

/**
 * 전체 게시글 목록 조회 API
 * - 제목, 작성자명, 작성 날짜를 조회하기
 * - 작성 날짜를 기준으로 내림차순 정렬하기
 */
router.get("/", async (req, res) => {
  try {
    const data = await db.Post.findAll({
      raw: true,
      attributes: [
        "postId",
        "User.nickname",
        "title",
        "content",
        "createdAt",
        "updatedAt",
        "userId",
      ],
      // attributes: {
      //   include: ["User.nickname"],
      //   exclude: ["userId"],
      // },
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
    console.log(e);
    return res
      .status(400)
      .json({ errorMessage: "게시글 목록 조회에 실패했습니다." });
  }
});

/**
 * 게시글 작성 API
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { title, content } = req.body;
    await db.Post.create({
      title,
      content,
      userId,
    });
    return res.status(201).json({
      message: "게시글 작성에 성공했습니다.",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ errorMessage: "게시글 작성에 실패했습니다." });
  }
});

/**
 * 게시글 수정 API
 * - 입력된 비밀번호를 확인하여 수정
 */
router.put("/:postId", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    const { title, content } = req.body;

    const post = await db.Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        errorMessage: "해당하는 글이 없습니다.",
      });
    }
    if (post.userId !== userId) {
      return res.status(401).json({
        errorMessage: "권한이 없습니다.",
      });
    }
    await post.update({
      title: title || post.title,
      content: content,
      updatedAt: new Date(),
    });
    await post.save();
    return res.status(200).json({
      message: "게시글을 업데이트했습니다.",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ errorMessage: "게시글 수정에 실패했습니다." });
  }
});

router.put("/:postId/like", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;

  try {
    const post = await db.Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        errorMessage: "해당하는 글이 없습니다.",
      });
    }
    const like = await db.Post.findOne({
      where: {
        userId,
        postId,
      },
    });
    if (like) {
      await post.update({
        likes: post.likes - 1,
      });
      await post.save();
      await like.destroy();
      await like.save();
    } else {
      post.update({
        likes: post.likes + 1,
      });
      await post.save();
      await db.Like.create({
        userId,
        postId,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      errorMessage: "게시글 좋아요에 실패하였습니다.",
    });
  }
});

/**
 * 게시글 삭제 API
 */
router.delete("/:postId", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { postId } = req.params;

    const post = await db.Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        errorMessage: "해당하는 글이 없습니다.",
      });
    }
    if (post.userId !== userId) {
      return res.status(401).json({
        errorMessage: "권한이 없습니다.",
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
      .json({ errorMessage: "게시글을 삭제하지 못 했습니다." });
  }
});

module.exports = router;
