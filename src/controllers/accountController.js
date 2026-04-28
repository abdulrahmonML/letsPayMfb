const accountService = require("../services/accountService");

const getAccountDetails = async (req, res, next) => {
  try {
    const accountId = req.user.accountId;
    const name = `${req.user.name.firstName} ${req.user.name.lastName}`;

    const account = await accountService.fetchAccountDetails(accountId, name);

    return res.status(200).json({
      success: true,
      message: "Account details fetched successfully",
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

const getAccountBalance = async (req, res) => {
  try {
    const accountId = req.user.accountId;

    const balance = await accountService.fetchBalance(accountId);

    return res.status(200).json({
      success: true,
      message: "Account balance fetched",
      data: balance,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAccountDetails, getAccountBalance };
