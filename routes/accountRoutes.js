const express = require("express");
const {
  getAllAccountsByUser,
  deleteAccount,
  addAccount,
  updateAccount,
} = require("../controller/accountController");
const middleware = require("../middleware");
const router = express.Router();

//get all Accounts by user
router.get("/", middleware, getAllAccountsByUser);

//add a Account
router.post("/add", middleware, addAccount);

//update account
router.put("/update/:id", middleware, updateAccount);

//delete account
router.delete("/delete/:id", middleware, deleteAccount);

module.exports = router;
