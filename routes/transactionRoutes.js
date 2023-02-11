const express = require("express");
const { getHomeData } = require("../controller/homeController");
const {
  getAllTransactionsByUser,
  updateTransaction,
  addTransaction,
  deleteTransaction,
} = require("../controller/transactionController");
const middleware = require("../middleware");
const router = express.Router();

//get all transactions
router.get("/", middleware, getAllTransactionsByUser);

//add a transaction
router.post("/add", middleware, addTransaction, getHomeData);

//update a transaction
router.put("/update/:id", middleware, updateTransaction, getHomeData);

//delete a transaction
router.delete("/delete/:id", middleware, deleteTransaction, getHomeData);

module.exports = router;
