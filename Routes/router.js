const { Router } = require("express");
const router = Router();
const { getProducts, getProductByID } = require("../Controllers/controllers");

router.get("/", getProducts);
router.get("/:id", getProductByID);

module.exports = router;
