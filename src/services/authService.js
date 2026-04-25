const AppError = require("../utils/appError");
const User = require("../models/user");
const Bvn = require("../models/bvn");
const Account = require("../models/account");
const generateuniqueBvn = require("../utils/generateBvn");
const nibssService = require("../services/nibssService");
const Bvn = require("../models/bvn");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerUser = async (
  firstName,
  lastName,
  phone,
  email,
  password,
  dob,
) => {
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

  //create bvn
  const generatedBvn = await generateUniqueBvn(firstName, lastName, dob);

  // create account
  const nibssAccount = await nibssService.createAccount(
    "bvn",
    generatedBvn,
    dob,
  );

  // SAVE bvn details
  const bvnDetails = await Bvn.create({
    user: user._id,
    bvnNo: generatedBvn,
  });

  const accountDetails = await Account.create({
    userId: user._id,
    acctNo: nibssAccount.accountNumber,
    balance: nibssAccount.balance,
    status: "active",
    bankCode: nibssAccount.bankCode,
    bankName: nibssAccount.bankName,
  });

  await User.findByIdAndUpdate(user._id, {
    bvnId: bvnDetails._id,
    accountId: accountDetails._id,
  });

  return { bvnDetails, accountDetails, user };
};

//LOGIN SERVICE
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Invalid Credentials", 400);
  }

  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword) {
    throw new AppError("Invalid credentials", 400);

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );
  }
};

module.exports = { registerUser };
