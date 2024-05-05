const jwt = require("jsonwebtoken");
const getToken = require("./get-token");

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).json({ msg: "Acesso negado" });
  }
  const token = getToken(req);

  if (!token) {
    res.status(401).json({ msg: "Acesso negado" });
  }

  try {
    const verified = jwt.verify(
      token,
      "f1b6b2c67c8c376eaa695ae4d04cba0758ff5306417d52a883293251e17ddbc2"
    );
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ msg: "Token inválido" });
  }
};

module.exports = verifyToken;
