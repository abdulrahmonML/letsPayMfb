const AppError = require("../utils/appError");
const User = require("../models/user");
const Nin = require("../models/nin");
const Account = require("../models/account");
const generateUniqueNin = require("../utils/generateNin");
const nibssService = require("../services/nibssService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const register = async (firstName, lastName, phone, email, password, dob) => {
  //check if user exist
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User exists, Kindly login to your account", 400);
  }

  //create user

  // password hashed in model.
  const user = await User.create({
    name: {
      firstName,
      lastName,
    },
    phone,
    email,
    password,
    dob,
  });

  //create nin
  const generatedNin = await generateUniqueNin(firstName, lastName, dob);

  const nin = generatedNin;
  const kycType = "nin";

  // create account

  const nibssAccount = await nibssService.createAccount(kycType, nin, dob);

  // SAVE nin details
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

//LOGIN SERVICE
const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Invalid Credentials", 400);
  }

  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword) {
    throw new AppError("Invalid credentials", 400);
  }
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  return {
    token: token,
    user: {
      name: user.name,
    },
  };
};

module.exports = { register, login };
