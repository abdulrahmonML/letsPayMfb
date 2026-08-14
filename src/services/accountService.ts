const nibssService = require("../services/nibssService");
const Account = require("../models/account");
require("dotenv").config;
const AppError = require("../utils/appError");

const fetchAccountDetails = async (accountId, name) => {
  //Find account in database by userId
  const account = await Account.findById(accountId);
  if (!account) {
    throw new AppError("Account record not found", 404);
  }

  //confirm account balance
  let nibssAccount;
  try {
    nibssAccount = await nibssService.getBalance(account.acctNo);
  } catch (error) {
    // If NIBSS is down, fall back to DB balance instead of crashing
    console.error("NIBSS Balance Sync Failed:", error.message);
    nibssAccount = { balance: account.balance };
  }
  // Reconcile balance
  if (nibssAccount.balance !== account.balance) {
    account.balance = nibssAccount.balance;
    await account.save();
  }

  return {
    accountNumber: account.acctNo,
    accountName: name,
    balance: account.balance,
    bankCode: account.bankCode,
    bankName: process.env.FINTECH_NAME || "LetsPay MFB",
  };
};

const fetchBalance = async (accountId) => {
  //Find account in database by userId
  const account = await Account.findById(accountId);
  if (!account) {
    throw new AppError("Account record not found", 404);
  }

  //confirm account balance
  let nibssAccount;
  try {
    nibssAccount = await nibssService.getBalance(account.acctNo);
  } catch (error) {
    // If NIBSS is down, fall back to DB balance instead of crashing
    console.error("NIBSS Balance Sync Failed:", error.message);
    nibssAccount = { balance: account.balance };
  }
  // Reconcile balance
  if (nibssAccount.balance !== account.balance) {
    account.balance = nibssAccount.balance;
    await account.save();
  }

  return {
    accountNumber: account.acctNo,
    balance: account.balance,
    currency: "NGN",
  };
};

const recipientName = async (accountNumber) => {
  try {
    const result = await nibssService.nameEnquiry(accountNumber);

    return {
      accountNumber: result.accountNumber,
      accountName: result.accountName,
      bank: result.bank,
    };
  } catch (error) {
    throw new AppError(
      "Unable to fetch recipient Name. Please try again.",
      500,
    );
  }
};

module.exports = {
  fetchAccountDetails,
  fetchBalance,
  recipientName,
};
