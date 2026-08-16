import AppError from "../utils/appError";
import User from "../models/user";
import Nin from "../models/nin";
import Account from "../models/account";
import generateUniqueNin from "../utils/generateNin";
import * as nibssService from "../services/nibssService";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { INin, IAccount, IUser, LoginResult } from "../types";

interface RegisterResult {
  ninDetails: INin;
  accountDetails: IAccount;
  user: IUser;
}


const register = async (
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  password: string,
  dob: string,
): Promise<RegisterResult> => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User exists, Kindly login to your account", 409);
  }

  const user = await User.create({
    name: { firstName, lastName },
    phone,
    email,
    password,
    dob,
  });

  const nin = await generateUniqueNin(firstName, lastName, dob);

  let nibssAccount;
  try {
    nibssAccount = await nibssService.createAccount("nin", nin, dob);
  } catch (error) {
    throw new AppError("Unable to create Account. Please try again.", 500);
  }

  const ninDetails = await Nin.create({
    user: user._id,
    ninNo: nin,
  });

  const accountDetails = await Account.create({
    userId: user._id,
    acctNo: nibssAccount.account.accountNumber,
    balance: nibssAccount.account.balance,
    status: "active",
    bankCode: nibssAccount.account.bankCode,
  });

  await User.findByIdAndUpdate(user._id, {
    ninId: ninDetails._id,
    accountId: accountDetails._id,
  });

  return { ninDetails, accountDetails, user };
};

const login = async (
  email: string,
  password: string,
): Promise<LoginResult> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Invalid Credentials", 400);
  }

  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword) {
    throw new AppError("Invalid credentials", 400);
  }

  if (!process.env.JWT_SECRET) {
    throw new AppError("Server misconfiguration", 500);
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return {
    token,
    user: {
      name: user.name,
      email: user.email,
    },
  };
};

export { register, login };