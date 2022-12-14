const { Router } = require("express");
const router = Router();
const {getProducts} = require("../Controllers/controllers")


router.get('/', getProducts)

module.exports = router
