/* /////////////////
const Account = require("../models/account");
const nibssService = require("../services/nibssService");
const Transaction = require("../models/transaction");

// SENDER VALIDATION HELPER

const getValidatedSender = async (accountId) => {
  const sender = await Account.findById(accountId).populate({
    path: "userId",
    select: "name.firstName name.lastName email",
  });

  if (!sender || !sender.acctNo) {
    throw new AppError("Sender account not found", 404);
  }

  return sender;
};

//RECIPIENT VERIFICATION HELPER

const verifyRecipient = async (accountNumber) => {
  try {
    return await nibssService.nameEnquiry(accountNumber);
  } catch {
    throw new AppError("Unable to verify recipient account", 400);
  }
};

//BALANCE RECONCILIATION HELPER
const reconcileBalance = async (sender) => {
  const nibssBalance = await nibssService.getBalance(sender.acctNo);

  if (nibssBalance.balance !== sender.balance) {
    sender.balance = nibssBalance.balance;
    await sender.save();
  }
};

//EMAIL SENDING HELPER

const sendTransferEmail = async (sender, transaction, beneficiary) => {
  return sendEmail({
    to: sender.userId.email,
    subject: "Transfer Successful - LetsPay MFB",
    html: transferEmailTemplate({
      transactionRef: transaction.transactionRef,
      amount: transaction.amount,
      recipientName: beneficiary.accountName,
      recipientAccountNumber: beneficiary.accountNumber,
      recipientBank: process.env.FINTECH_NAME,
      newBalance: sender.balance,
      timestamp: transaction.createdAt,
    }),
  });
};

const createPendingTransaction = async (
  sender,
  from,
  amount,
  transactionRef,
  beneficiaryName,
  beneficiaryAcct,
  idempotencyKey,
) => {
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

  return transaction;
};

const processNibssTransfer = async (from, to, amount, transaction) => {
  try {
    return await nibssService.transfer(from, to, amount);
  } catch (error) {
    transaction.status = "FAILED";
    await transaction.save();
    throw new AppError("Transfer failed. Please try again.", 400);
  }
};

module.exports = {
  getValidatedSender,
  verifyRecipient,
  reconcileBalance,
  createPendingTransaction,
  processNibssTransfer,
};
 */
