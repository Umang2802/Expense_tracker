const { getHomeData } = require("../controller/homeController");
const {
  login,
  register,
  info,
  updateUser,
  check_user_email,
} = require("../controller/userController");
const middleware = require("../middleware");

const router = require("express").Router();

router.get("/", middleware, info);
router.post("/email", check_user_email);
router.post("/login", login, getHomeData);
router.post("/register", register);
router.put("/update", middleware, updateUser, getHomeData);

module.exports = router;
