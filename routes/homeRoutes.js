const router = require("express").Router();
const { getHomeData } = require("../controller/homeController");
const middleware = require("../middleware");

router.get("", middleware, getHomeData);
router.get("/trial", (req, res) => res.send("It works"));

module.exports = router;
