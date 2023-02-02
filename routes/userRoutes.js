const {
  login,
  register,
  info,
  updateUser,
} = require("../controller/userController");
const middleware = require("../middleware");

const router = require("express").Router();

router.get("/", middleware, info);
router.post("/login", login);
router.post("/register", register);
router.put("/update", middleware, updateUser);

module.exports = router;
