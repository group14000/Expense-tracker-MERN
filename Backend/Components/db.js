// db.js
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/expense-tracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define user schema using Mongoose
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Define a schema for expenses
const expenseSchema = new mongoose.Schema({
  amountSpent: String,
  expenseDescription: String,
  expenseCategory: String,
  expenseDate: String,
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = { User, Expense };
