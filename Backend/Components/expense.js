// Import the Express framework for building web applications
const express = require("express");

// Import the bodyParser middleware to parse incoming JSON data in the request body
const bodyParser = require("body-parser");

// Import the Expense model from the "db" module
const { Expense } = require("./db");

// Create an Express application
const app = express();

// Use the bodyParser middleware to parse JSON data in the request body
app.use(bodyParser.json());

// Define a route to handle POST requests for adding expenses
app.post("/api/add-expense", async (req, res) => {
  // Destructure expense data from the request body
  const { amountSpent, expenseDescription, expenseCategory, expenseDate } =
    req.body;

  try {
    // Create a new Expense instance with the provided data
    const newExpense = new Expense({
      amountSpent,
      expenseDescription,
      expenseCategory,
      expenseDate,
    });

    // Save the new expense to the database
    await newExpense.save();

    // Send a success response to the client
    res.status(200).json({ message: "Expense added successfully!" });
  } catch (error) {
    // Handle errors by logging and sending an error response
    console.error("Error adding expense:", error.message);
    res.status(500).json({ error: "Error adding expense. Please try again." });
  }
});

app.get("/api/get-expenses", async (req, res) => {
  try {
    const page = req.query.page || 1; // Get the requested page from the query parameter
    const limit = 10; // Number of items per page

    // Calculate the skip value to implement LIFO order
    const skip = (page - 1) * limit;

    // Fetch expenses with pagination and LIFO order
    const expenses = await Expense.find()
      .sort({ _id: -1 }) // Sort in descending order by _id (assuming _id is a timestamp)
      .skip(skip)
      .limit(limit);

    // Send the list of expenses as a JSON response to the client
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Error fetching expenses" });
  }
});

// Define a route to handle DELETE requests for deleting an expense by ID
app.delete("/api/delete-expense/:id", async (req, res) => {
  // Extract the expense ID from the request parameters
  const expenseId = req.params.id;

  try {
    // Find and delete the expense with the specified ID
    await Expense.findByIdAndDelete(expenseId);

    // Send a success response to the client
    res.json({ success: true });
  } catch (error) {
    // Handle errors by logging and sending an error response
    console.error("Error deleting expense:", error);
    res.status(500).json({ success: false, error: "Error deleting expense" });
  }
});

// Export the Express application for use in other parts of the application
module.exports = app;
