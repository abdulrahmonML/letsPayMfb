const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");

const {
  transferMoney,
  getTransactionsByAccount,
  getTransactionByReference,
} = require("../controllers/transactionController");

router.post("/transfer", protect, transferMoney);
router.get("/", protect, getTransactionsByAccount);
router.get("/:id", protect, getTransactionByReference);

module.exports = router;
