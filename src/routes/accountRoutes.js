const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");

const {
  getAccountDetails,
  getAccountBalance,
} = require("../controllers/accountController");

router.get("/", protect, getAccountDetails);
router.get("/balance", protect, getAccountBalance);

module.exports = router;
