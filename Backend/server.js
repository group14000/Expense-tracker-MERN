// Import the Express framework for building web applications
const express = require("express");

// Import user-related routes from the "user" module
const userRoutes = require("./Components/user");

// Import expense-related routes from the "expense" module
const expenseRoutes = require("./Components/expense");

// Import payment-related routes from the "paymentRoutes" module
const paymentRoutes = require("./Components/paymentRoutes");

// Create an Express application
const app = express();

// Set the port number to 3001
const PORT = 3001;

// Use the userRoutes to handle routes related to user functionality
app.use(userRoutes);

// Use the expenseRoutes to handle routes related to expense functionality
app.use(expenseRoutes);

// Use the paymentRoutes for routes related to payments, accessible at the root "/"
app.use("/", paymentRoutes);

// Start the server on the specified port and log a message upon successful server startup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
