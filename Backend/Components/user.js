// Import necessary libraries: Express for web application, bcrypt for password hashing, jwt for JSON web tokens, bodyParser for parsing JSON data, User model from the "db", and Nodemailer for sending emails
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { User } = require("./db");
const nodemailer = require("nodemailer"); // Add Nodemailer

// Create an Express application
const app = express();

// Use bodyParser middleware to parse JSON data in the request body
app.use(bodyParser.json());

// Create a Nodemailer transporter with Gmail service and authentication credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "groupcaptain40@gmail.com", 
    pass: "lytv avgp blqc ygmk", 
  },
});

// Define a route to handle POST requests for user signup
app.post("/signup", async (req, res) => {
  // Destructure user data from the request body
  const { name, email, password } = req.body;

  try {
    // Check if the user with the provided email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email already exists. Please use a different email." });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User instance with the hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Generate a JWT token for the user
    const token = jwt.sign({ userId: newUser._id }, "your-secret-key");

    // Send a success response with the token
    res.status(200).json({ message: "Signup successful!", token });
  } catch (error) {
    // Handle errors during signup by logging and sending an error response
    console.error("Error during signup:", error.message);
    res.status(500).json({ error: "Signup failed. Please try again." });
  }
});

// Define a route to handle POST requests for user login
app.post("/login", async (req, res) => {
  // Destructure login credentials from the request body
  const { email, password } = req.body;

  try {
    // Find the user with the provided email
    const user = await User.findOne({ email });

    // Return an error if the user is not found
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Return an error if passwords do not match
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ userId: user._id }, "your-secret-key");

    // Send a success response with the token
    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    // Handle errors during login by logging and sending an error response
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// Define a route to handle POST requests for forgot password functionality
app.post("/forgot-password", async (req, res) => {
  // Destructure the email from the request body
  const { email } = req.body;

  try {
    // Find the user with the provided email
    const user = await User.findOne({ email });

    // Return an error if the user is not found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a temporary token for password reset with a 1-hour expiration
    const resetToken = jwt.sign({ userId: user._id }, "your-reset-secret-key", {
      expiresIn: "1h",
    });

    // Build the password reset link with the generated token
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Configure email options with the reset link
    const mailOptions = {
      from: "your-email@gmail.com", // Replace with your Gmail email address
      to: email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    // Send the password reset email and handle success or error
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json({ error: "Error sending email. Please try again." });
      }
      console.log("Email sent:", info.response);
      res
        .status(200)
        .json({ message: "Password reset email sent successfully!" });
    });
  } catch (error) {
    // Handle errors during forgot password by logging and sending an error response
    console.error("Error during forgot password:", error.message);
    res
      .status(500)
      .json({ error: "Forgot password failed. Please try again." });
  }
});

// Export the Express application for use in other parts of the application
module.exports = app;
