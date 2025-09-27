import Expense from "../models/Expense.js";

export const getAllExpenses = async () => {
  return await Expense.find().sort({ date: -1 });
};

export const getExpenseById = async (id) => {
  return await Expense.findById(id);
};

export const createExpense = async (data) => {
  const expense = new Expense(data);
  return await expense.save();
};

export const updateExpense = async (id, data) => {
  return await Expense.findByIdAndUpdate(id, data, { new: true });
};

export const deleteExpense = async (id) => {
  return await Expense.findByIdAndDelete(id);
};
