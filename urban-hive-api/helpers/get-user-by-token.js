const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getUserByToken = async (token) => {
  if (!token) {
    res.status(401).json({ msg: "Acesso negado" });
  }
  const decoded = jwt.verify(
    token,
    "f1b6b2c67c8c376eaa695ae4d04cba0758ff5306417d52a883293251e17ddbc2"
  );

  const userId = decoded.id;

  const user = await User.findById(userId);
  user.password = undefined;

  return user;
};

module.exports = getUserByToken;
