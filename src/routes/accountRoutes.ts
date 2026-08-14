const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");

const {
  getAccountDetails,
  getAccountBalance,
  getRecipientName,
} = require("../controllers/accountController");

router.get("/", protect, getAccountDetails);
router.get("/balance", protect, getAccountBalance);
router.post("/name-enquiry", protect, getRecipientName);

module.exports = router;
