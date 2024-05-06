const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getUserByToken = async (token) => {
  if (!token) {
    res.status(401).json({ msg: "Acesso negado" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const userId = decoded.id;

  const user = await User.findById(userId);
  user.password = undefined;

  return user;
};

module.exports = getUserByToken;
