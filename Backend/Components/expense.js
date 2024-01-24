// expense.js
const express = require("express");
const bodyParser = require("body-parser");
const { Expense } = require("./db");

const app = express();
app.use(bodyParser.json());

app.post("/api/add-expense", async (req, res) => {
  const { amountSpent, expenseDescription, expenseCategory, expenseDate } =
    req.body;

  try {
    const newExpense = new Expense({
      amountSpent,
      expenseDescription,
      expenseCategory,
      expenseDate,
    });

    await newExpense.save();

    res.status(200).json({ message: "Expense added successfully!" });
  } catch (error) {
    console.error("Error adding expense:", error.message);
    res.status(500).json({ error: "Error adding expense. Please try again." });
  }
});

app.get("/api/get-expenses", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Error fetching expenses" });
  }
});

app.delete("/api/delete-expense/:id", async (req, res) => {
  const expenseId = req.params.id;

  try {
    await Expense.findByIdAndDelete(expenseId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ success: false, error: "Error deleting expense" });
  }
});

module.exports = app;
