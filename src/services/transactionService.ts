import transferEmailTemplate from "../email/templates";
import sendEmail from "./emailService";
import Account from "../models/account";
import Transaction from "../models/transaction";
import AppError from "../utils/appError";
import generateRef from "../utils/generateReference";
import * as nibssService from "./nibssService";
import { TransferResult, ITransaction } from "../types";

const transfer = async (
  accountId: string,
  to: string,
  amount: number,
): Promise<TransferResult | ITransaction> => {
  const sender = await Account.findById(accountId).populate<{
    userId: { name: { firstName: string; lastName: string }; email: string };
  }>({
    path: "userId",
    select: "name.firstName name.lastName email",
  });

  if (!sender || !sender.acctNo) {
    throw new AppError(
      `Sender Account 
       not found: Kindly check account Number and try again.`,
      404,
    );
  }

  const from = sender.acctNo;
  const senderEmail = sender.userId.email;

  if (from === to) {
    throw new AppError("You cannot transfer to your own account", 400);
  }

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

  const idempotencyKey = `${from}${to}${amount}${sender.userId.name.firstName}`;

  const existingTransaction = await Transaction.findOne({
    idempotencyKey,
    status: "PENDING",
    createdAt: { $gt: new Date(Date.now() - 30 * 60 * 1000) },
  });

  if (existingTransaction) {
    return existingTransaction;
  }

  let senderNibssBalance;
  try {
    senderNibssBalance = await nibssService.getBalance(from);
  } catch (error) {
    console.log("NIBSS Balance Sync Failed:", (error as Error).message);
  }

  if (senderNibssBalance && senderNibssBalance.balance !== sender.balance) {
    sender.balance = senderNibssBalance.balance;
    await sender.save();
  }

  if (amount > sender.balance) {
    throw new AppError("Insufficient funds", 400);
  }

  const transactionRef = generateRef();

  const transaction = await Transaction.create({
    accountId: sender._id,
    transactionRef,
    amount: amount,
    type: "DEBIT",
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

  let nibssTransfer;
  try {
    nibssTransfer = await nibssService.transfer(from, to, amount);
  } catch (error) {
    transaction.status = "FAILED";
    await transaction.save();
    throw new AppError("Transfer failed. Please try again.", 500);
  }

  const currentBalance = sender.balance;
  const transactionId = nibssTransfer.reference;

  if (nibssTransfer.status === "SUCCESS") {
    transaction.nibssTransactionId = transactionId;
    transaction.status = "SUCCESS";
    await transaction.save();
    sender.balance = currentBalance - amount;
    await sender.save();

    sendEmail({
      to: senderEmail,
      subject: "Transfer Successful - LetsPay MFB",
      html: transferEmailTemplate({
        transactionRef: transaction.transactionRef,
        amount: amount,
        recipientName: beneficiaryName,
        recipientAccountNumber: beneficiaryAcct,
        recipientBank: process.env.FINTECH_NAME || "LetsPay MFB",
        newBalance: sender.balance,
        timestamp: transaction.createdAt,
      }),
    }).catch((err) => console.error(err));
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
      balance: sender.balance,
    },
    recipient: {
      name: beneficiaryName,
      accountNumber: to,
    },
    sessionId: transactionId,
    timestamp: transaction.createdAt,
  };
};

const fetchTransactionsByAccount = async (
  accountId: string,
): Promise<ITransaction[]> => {
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

const fetchTransactionByRefeference = async (id: string) => {
  const transaction = await Transaction.findOne({ transactionRef: id });

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  const nibssId = transaction.nibssTransactionId;
  let nibssTransaction;

  try {
    nibssTransaction = await nibssService.getTransactionStatus(nibssId!);
  } catch (error) {
    throw new AppError(
      "Unable to fetch Transaction status. Please try again.",
      500,
    );
  }

  if (nibssTransaction.status !== transaction.status) {
    transaction.status = nibssTransaction.status as typeof transaction.status;
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

export { transfer, fetchTransactionsByAccount, fetchTransactionByRefeference };
