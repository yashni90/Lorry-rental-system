import * as expenseService from "../service/expenseService.js";

// GET all expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await expenseService.getAllExpenses();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

// GET single expense
export const getExpense = async (req, res) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id);
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expense" });
  }
};

// POST create new expense
export const createExpense = async (req, res) => {
  try {
    const expense = await expenseService.createExpense(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: "Failed to create expense" });
  }
};

// PUT update expense
export const updateExpense = async (req, res) => {
  try {
    const expense = await expenseService.updateExpense(req.params.id, req.body);
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: "Failed to update expense" });
  }
};

// DELETE expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await expenseService.deleteExpense(req.params.id);
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
};
