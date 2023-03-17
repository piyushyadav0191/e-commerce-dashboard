const { Router } = require("express");

const { getBestProducts } = require("../controllers/ranking.controller");

const router = Router();

/** Only ecommerce */

router.get("/bestProducts", getBestProducts);

module.exports = router;
