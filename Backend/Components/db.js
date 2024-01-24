// Import the Mongoose library for MongoDB interaction
const mongoose = require("mongoose");

// Connect to the MongoDB database named "expense-tracker" on the local server
mongoose.connect("mongodb://127.0.0.1:27017/expense-tracker", {
  useNewUrlParser: true, // Use new URL parser
  useUnifiedTopology: true, // Use new server discovery and monitoring engine
});

// Define a Mongoose schema for the User model with name, email, and password fields
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Create a Mongoose model named "User" based on the userSchema
const User = mongoose.model("User", userSchema);

// Define a Mongoose schema for the Expense model with amountSpent, expenseDescription, expenseCategory, and expenseDate fields
const expenseSchema = new mongoose.Schema({
  amountSpent: String,
  expenseDescription: String,
  expenseCategory: String,
  expenseDate: String,
});

// Create a Mongoose model named "Expense" based on the expenseSchema
const Expense = mongoose.model("Expense", expenseSchema);

// Export the User and Expense models for use in other parts of the application
module.exports = { User, Expense };
