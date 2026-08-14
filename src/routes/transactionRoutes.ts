const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");

const {
  transferMoney,
  getTransactionsByAccount,
  getTransactionByReference,
} = require("../controllers/transactionController");

const validate = require("../middleware/validate");

const transferSchema = require("../validators/transferValidator");

router.post("/transfer", protect, validate(transferSchema), transferMoney);
router.get("/", protect, getTransactionsByAccount);
router.get("/:id", protect, getTransactionByReference);

module.exports = router;
