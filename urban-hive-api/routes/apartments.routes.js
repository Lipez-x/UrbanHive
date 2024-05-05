const ApartmentController = require("../controllers/apartments.controller");
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

const router = require("express").Router();

module.exports = router;

router.post(
  "/create",
  verifyToken,
  imageUpload.array("images"),
  ApartmentController.create
);
router.get("/", ApartmentController.getAll);
router.get(
  "/myapartments",
  verifyToken,
  ApartmentController.getAllUserApartments
);
router.get(
  "/mylocations",
  verifyToken,
  ApartmentController.getAllUserLocations
);
router.get("/:id", ApartmentController.getApartmentById);
router.delete("/:id", verifyToken, ApartmentController.deleteApartmentById);
router.patch(
  "/:id",
  verifyToken,
  imageUpload.array("images"),
  ApartmentController.updateApartment
);
router.patch("/schedule/:id", verifyToken, ApartmentController.schedule);
router.patch(
  "/conclude/:id",
  verifyToken,
  ApartmentController.concludeLocation
);
