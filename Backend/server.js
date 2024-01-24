// Import necessary dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3001;

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

// Middleware for parsing JSON in the request body
app.use(bodyParser.json());

// Route for handling user signup
app.post("/signup", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email already exists. Please use a different email." });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token for user authentication
    const token = jwt.sign({ userId: newUser._id }, "your-secret-key");

    res.status(200).json({ message: "Signup successful!", token });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ error: "Signup failed. Please try again." });
  }
});

// Route for handling user login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the entered password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token for user authentication
    const token = jwt.sign({ userId: user._id }, "your-secret-key");

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
