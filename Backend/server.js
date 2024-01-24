// server.js
const express = require("express");
const userRoutes = require("./Components/user");
const expenseRoutes = require("./Components/expense");
const paymentRoutes = require("./Components/paymentRoutes")

const app = express();
const PORT = 3001;

app.use(userRoutes);
app.use(expenseRoutes);
app.use("/", paymentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
