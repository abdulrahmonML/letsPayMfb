import * as nibssService from "../services/nibssService";
import Account from "../models/account";
import AppError from "../utils/appError";
import { AccountDetails, NameEnquiryResult, BalanceResult } from "../types";
import { NibssBalanceResponse } from "./nibssService";

const fetchAccountDetails = async (
  accountId: string,
  name: string,
): Promise<AccountDetails> => {
  //Find account in database by userId
  const account = await Account.findById(accountId);
  if (!account) {
    throw new AppError("Account record not found", 404);
  }

  //confirm account balance
  let nibssAccount: NibssBalanceResponse;
  try {
    nibssAccount = await nibssService.getBalance(account.acctNo);
  } catch (error) {
    // If NIBSS is down, fall back to DB balance instead of crashing
    console.error("NIBSS Balance Sync Failed:", (error as Error).message);
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

const fetchBalance: (accountId: string) => Promise<BalanceResult> = async (
  accountId: string,
) => {
  //Find account in database by userId
  const account = await Account.findById(accountId);
  if (!account) {
    throw new AppError("Account record not found", 404);
  }

  //confirm account balance
  let nibssAccount: NibssBalanceResponse;
  try {
    nibssAccount = await nibssService.getBalance(account.acctNo);
  } catch (error) {
    console.error("NIBSS Balance Sync Failed:", (error as Error).message);
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

const recipientName = async (
  accountNumber: string,
): Promise<NameEnquiryResult> => {
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

export { fetchAccountDetails, fetchBalance, recipientName };
