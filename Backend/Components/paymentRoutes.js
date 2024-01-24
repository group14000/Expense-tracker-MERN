// Import the 'express' module for creating a web server
const express = require("express");

// Create an instance of the Express Router
const router = express.Router();

// Import the 'Razorpay' module for handling payments
const Razorpay = require("razorpay");

// Import the 'cors' module for enabling Cross-Origin Resource Sharing (CORS)
const cors = require("cors");

// Enable CORS for all routes in this router
router.use(cors());

// Route for handling POST requests to initiate payments
router.post("/payments", async (req, res) => {
  try {
    // Destructure the 'amount' from the request body
    const { amount } = req.body;

    // Validate the amount, ensuring it is present and is a valid number
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ success: false, error: "Invalid amount" });
    }

    // Create a new instance of Razorpay with API key and secret
    const instance = new Razorpay({
      key_id: "rzp_test_s43txngfMkfE7D",
      key_secret: "mMPlpfCyt71uW1cf7xHCeQY0",
    });

    // Create a payment order using the instance with specified details
    const order = await instance.orders.create({
      amount: amount * 100, // Convert amount to paisa (currency subunit)
      currency: "INR", // Set currency to Indian Rupees
      receipt: "receipt#1", // Set a receipt identifier
      payment_capture: 1, // Automatically capture the payment upon successful authorization
    });

    // Send a 201 Created response with details of the created order and the original amount
    res.status(201).json({
      success: true,
      order,
      amount,
    });
  } catch (error) {
    // Log and handle errors, sending a 500 Internal Server Error response with a JSON payload
    console.error("Error in /payments route:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Export the router for use in other modules
module.exports = router;