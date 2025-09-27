const express = require("express");
const {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controller/expenseController.js");

const router = express.Router();

// GET all & POST new
router.route("/")
  .get(getExpenses)
  .post(createExpense);

// GET single, PUT update, DELETE
router.route("/:id")
  .get(getExpense)
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;
