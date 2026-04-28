const Account = require("../models/account");
const Transaction = require("../models/transaction");
const AppError = require("../utils/appError");
const generateRef = require("../utils/generateReference");
const nibssService = require("../services/nibssService");

const transfer = async (accountId, to, amount) => {
  // VERIFY RECIPIENT EXISTS WITH A CORRECT ACCOUNT
  let validBeneficiary;
  try {
    validBeneficiary = await nibssService.nameEnquiry(to);
  } catch (error) {
    throw new AppError(
      "Unable to verify recipient account. Please try again.",
      400,
    );
  }

  const beneficiaryAcct = validBeneficiary.accountNumber;
  const beneficiaryName = validBeneficiary.accountName;

  if (beneficiaryAcct !== to) {
    throw new AppError(
      "Recipient not found: Kindly check account Number and try again.",
      404,
    );
  }

  //GET SENDER DETAILS
  const sender = await Account.findById(accountId).populate({
    path: "userId",
    select: "name.firstName name.lastName",
  });

  if (!sender.acctNo) {
    throw new AppError(
      `Sender Account 
       not found: Kindly check account Number and try again.`,
      404,
    );
  }

  const from = sender.acctNo;

  //GENERATE IDEMPOTENCYKEY
  const idempotencyKey = `${from}${to}${amount}${sender.userId.name.firstName}`;

  //CHECK IF KEY EXISTS WITHIN THE LAST 30mins TO PREVENT DUPLICATE TRANSFERS
  const existingTransaction = await Transaction.findOne({
    idempotencyKey,
    status: "PENDING", // only block if still processing
    createdAt: { $gt: new Date(Date.now() - 30 * 60 * 1000) }, // more than 30mins,
  });

  if (existingTransaction) {
    return existingTransaction; // duplicate — return original result
  }

  //RECONCILE BALANCE WITH NIBSS TO MAKE SURE BALANCE IS CORRECT
  let senderNibssBalance;
  try {
    senderNibssBalance = await nibssService.getBalance(from);
  } catch (error) {
    throw new AppError(
      "Unable to verify account balance. Please try again.",
      400,
    );
  }

  if (senderNibssBalance.balance !== sender.balance) {
    sender.balance = senderNibssBalance.balance;
    await sender.save();
  }

  // CHECK SUFFICIENT FUNDS
  if (amount > sender.balance) {
    throw new AppError("Insufficient funds", 400);
  }

  //GENERATE TRANSACTION REFERENCE
  const transactionRef = generateRef();

  //CREATE TRANSACTION RECORD
  const transaction = await Transaction.create({
    accountId: sender._id,
    transactionRef,
    amount: amount,
    type: "sendMoney",
    sender: {
      name: `${sender.userId.name.firstName} ${sender.userId.name.lastName}`,
      acctNo: from,
    },
    recipient: {
      name: beneficiaryName,
      acctNo: beneficiaryAcct,
    },
    status: "PENDING",
    idempotencyKey: idempotencyKey,
  });

  //CALL NIBSS TRANSFER SERVICE TO TRANSFER
  let nibssTransfer;
  try {
    nibssTransfer = await nibssService.transfer(from, to, amount);
  } catch (error) {
    transaction.status = "FAILED";
    await transaction.save();
    throw new AppError("Transfer failed. Please try again.", 400);
  }

  const currentBalance = sender.balance;
  const transactionId = nibssTransfer.reference;

  //UPDATE BALANCE IF SUCCESS
  if (nibssTransfer.status === "SUCCESS") {
    transaction.nibssTransactionId = transactionId;

    transaction.status = "SUCCESS";
    await transaction.save();
    sender.balance = currentBalance - amount;
    await sender.save();
  } else {
    transaction.status = "FAILED";
    await transaction.save();
    throw new AppError("Transfer Failed: Internal server Error", 500);
  }

  return {
    transactionRef: transaction.transactionRef,
    status: transaction.status,
    amount,
    sender: {
      accountNumber: from,
      balance: sender.balance, // updated balance after deduction
    },
    recipient: {
      name: beneficiaryName,
      accountNumber: to,
    },
    sessionId: transactionId,
    timestamp: transaction.createdAt,
  };
};

const fetchTransactionsByAccount = async (accountId) => {
  // Query for transactions where account is either sender or receiver
  const account = await Account.findById(accountId);
  if (!account) throw new AppError("Account not found", 404);

  const accountNumber = account.acctNo;

  const transaction = await Transaction.find({
    $or: [
      { "sender.acctNo": accountNumber },
      { "recipient.acctNo": accountNumber },
    ],
  })
    .select("-idempotencyKey -updatedAt -__v")
    .sort({ createdAt: -1 })
    .limit(50);

  return transaction;
};

const fetchTransactionByRefeference = async (id) => {
  const transaction = await Transaction.findOne({ transactionRef: id });

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  const nibssId = transaction.nibssTransactionId;
  let nibssTransaction;

  try {
    nibssTransaction = await nibssService.getTransactionStatus(nibssId);
  } catch (error) {
    throw new AppError(
      "Unable to fetch Transaction status. Please try again.",
      400,
    );
  }

  if (nibssTransaction.status !== transaction.status) {
    transaction.status = nibssTransaction.status;
    await transaction.save();
  }

  return {
    transactionId: transaction.nibssTransactionId,
    transactionRef: transaction.transactionRef,
    status: transaction.status,
    amount: transaction.amount,
    sender: transaction.sender,
    recipient: transaction.recipient,
    timestamp: transaction.createdAt,
    type: transaction.type,
  };
};

module.exports = {
  transfer,
  fetchTransactionsByAccount,
  fetchTransactionByRefeference,
};
