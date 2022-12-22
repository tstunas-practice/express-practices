const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  const [authType, authToken] = (token || "").split(" ");

  if (!authToken || authType !== "Bearer") {
    return res.status(401).json({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
  try {
    const { userId } = jwt.verify(authToken, "express-practice");
    User.findByPk(userId).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (e) {
    console.error(e);
  }
};
