const router = require("express").Router();
const UserController = require("../controllers/user.controller");
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

router.get("/checkuser", UserController.checkUser);
router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.patch(
  "/edit/:id",
  verifyToken,
  imageUpload.single("image"),
  UserController.editUser
);
router.get("/:id", UserController.getUserById);
module.exports = router;
