require("dotenv").config();
const express = require("express");
const app = express();
const CONNECTDB = require("./src/config/db");
const { onboard } = require("./src/services/nibssService");
const authRoutes = require("./src/routes/authRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const accountRoutes = require("./src/routes/accountRoutes");
const errorHandler = require("./src/middleware/errorHandler");
const AppError = require("./src/utils/appError");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5174" || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running properly");
});

CONNECTDB();

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/account", accountRoutes);

// 404 handler
app.use((req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
});

//error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, http://localhost:3000/`);
});
