// server.js
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

// Create a user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Middleware for parsing JSON
app.use(bodyParser.json());

// Route for handling signup
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
