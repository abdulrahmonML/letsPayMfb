require("dotenv").config();
const express = require("express");
const app = express();
const CONNECTDB = require("./src/config/db");
const { onboard } = require("./src/services/nibssService");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running properly");
});

CONNECTDB();

const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${PORT}, http://localhost:3000/`);
});
