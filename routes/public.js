const express = require("express");
const hashUtil = require("../utils/hash");
const router = express.Router();
const { User } = require("../models");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  const { nickname, password, confirm } = req.body;
  if (password !== confirm) {
    return res.status(412).json({
      errorMessage: "패스워드가 일치하지 않습니다.",
    });
  }
  if (!nickname || !/^[a-zA-Z0-9]{3,30}$/.test(nickname)) {
    return res.status(412).json({
      errorMessage: "ID의 형식이 일치하지 않습니다",
    });
  }
  if (!password || password.length < 4) {
    return res.status(412).json({
      errorMessage: "패스워드의 형식이 일치하지 않습니다.",
    });
  }
  if (password.indexOf(nickname) !== -1) {
    return res.status(412).json({
      errorMessage: "패스워드에 닉네임이 포함되어있습니다.",
    });
  }
  const existUser = await User.findOne({
    where: {
      nickname,
    },
  });
  if (existUser) {
    return res.status(412).json({
      errorMessage: "중복된 닉네임입니다.",
    });
  }
  await User.create({
    nickname,
    password: await hashUtil.hashPassword(password),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return res.status(201).json({
    message: "회원가입에 성공했습니다.",
  });
});

router.post("/login", async (req, res) => {
  const { nickname, password } = req.body;
  const user = await User.findOne({
    where: {
      nickname,
    },
  });
  if (!user || !(await hashUtil.comparePassword(password, user.password))) {
    return res.status(412).json({
      errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
    });
  }
  const token = jwt.sign({ userId: user.userId }, "express-practice");
  res.cookie("token", `Bearer ${token}`, {
    maxAge: 10800,
  });
  return res.status(200).json({
    message: "로그인 성공하였습니다.",
  });
});

module.exports = router;
