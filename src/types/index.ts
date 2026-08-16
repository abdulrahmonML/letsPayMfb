import { Document, Types } from "mongoose";

// ─── ENUMS ────────────────────────────────────────────────────────────────────

export type AccountStatus = "active" | "inactive";
export type TransactionType = "DEBIT" | "CREDIT";
export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED";

// ─── SUBDOCUMENT TYPES ────────────────────────────────────────────────────────

export interface UserName {
  firstName: string;
  lastName: string;
}

export interface TransactionParty {
  name: string;
  acctNo: string;
}

// ─── DOCUMENT INTERFACES ──────────────────────────────────────────────────────

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: UserName;
  phone: string;
  email: string;
  password: string;
  dob: string;
  ninId?: Types.ObjectId;
  accountId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAccount extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  acctNo: string;
  balance: number;
  status: AccountStatus;
  bankCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INin extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  ninNo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransaction extends Document {
  _id: Types.ObjectId;
  accountId: Types.ObjectId;
  nibssTransactionId: string | null;
  transactionRef: string;
  amount: number;
  sender: TransactionParty;
  recipient: TransactionParty;
  type: TransactionType;
  status: TransactionStatus;
  idempotencyKey: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── API TYPES ────────────────────────────────────────────────────────────────

export interface ApiResponse<T = void> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AccountDetails {
  accountNumber: string;
  accountName: string;
  balance: number;
  bankCode: string;
  bankName: string;
}

export interface TransferResult {
  transactionRef: string;
  status: TransactionStatus;
  amount: number;
  sender: {
    accountNumber: string;
    balance: number;
  };
  recipient: {
    name: string;
    accountNumber: string;
  };
  sessionId: string;
  timestamp: Date;
}

export interface LoginResult {
  token: string;
  user: {
    name: UserName;
    email: string;
  };
}

export interface NameEnquiryResult {
  accountNumber: string;
  accountName: string;
  bank: string;
}

// ─── JWT PAYLOAD ──────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: string;
  accountId: string;
  name: UserName;
  email: string;
}

// ─── EXPRESS REQUEST EXTENSION ────────────────────────────────────────────────

export interface AuthenticatedUser {
  userId: string;
  accountId: string;
  name: UserName;
  email: string;
}

export interface BalanceResult {
  accountNumber: string;
  balance: number;
  currency: string;
}
