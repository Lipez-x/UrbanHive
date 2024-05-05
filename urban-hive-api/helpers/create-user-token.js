const jwt = require("jsonwebtoken");

const createUserToken = async (user, req, res) => {
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    "f1b6b2c67c8c376eaa695ae4d04cba0758ff5306417d52a883293251e17ddbc2"
  );

  res.status(200).json({
    message: "Você está autenticado",
    token: token,
    userId: user._id,
  });
};

module.exports = createUserToken;
