const router = require("express").Router();
const { getHomeData } = require("../controller/homeController");
const middleware = require("../middleware");

router.get("", middleware, getHomeData);

module.exports = router;
