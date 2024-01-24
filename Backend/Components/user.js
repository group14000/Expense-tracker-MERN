// user.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { User } = require("./db");
const nodemailer = require("nodemailer"); // Add Nodemailer

const app = express();
app.use(bodyParser.json());

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "groupcaptain40@gmail.com", // Replace with your Gmail email address
    pass: "lytv avgp blqc ygmk", // Replace with your Gmail password or an app-specific password
  },
});


app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email already exists. Please use a different email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, "your-secret-key");

    res.status(200).json({ message: "Signup successful!", token });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ error: "Signup failed. Please try again." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, "your-secret-key");

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// Route for handling forgot password
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a temporary token for password reset
    const resetToken = jwt.sign({ userId: user._id }, "your-reset-secret-key", { expiresIn: "1h" });

    // Send email with password reset link
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: "your-email@gmail.com", // Replace with your Gmail email address
      to: email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Error sending email. Please try again." });
      }
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "Password reset email sent successfully!" });
    });
  } catch (error) {
    console.error("Error during forgot password:", error.message);
    res.status(500).json({ error: "Forgot password failed. Please try again." });
  }
});

module.exports = app;
