const jwt = require("jsonwebtoken");
const secret = "sparta";

module.exports = {
  signToken: (payload) => {
    return jwt.sign(payload, secret, { algorithm: "RS256" });
  },
  verifyToken: (token) => {
    return jwt.verify(token, secret);
  },
  decodeToken: (token) => {
    return jwt.decode(token);
  },
};
