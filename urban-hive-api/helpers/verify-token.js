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
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ msg: "Token inválido" });
  }
};

module.exports = verifyToken;
