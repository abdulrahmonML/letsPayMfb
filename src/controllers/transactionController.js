const transactionService = require("../services/transactionService");

const transferMoney = async (req, res, next) => {
  const { to, amount } = req.body;

  const { accountId } = req.user;

  try {
    const response = await transactionService.transfer(accountId, to, amount);

    res.status(200).json({
      success: true,
      message: "Transfer successful",
      transactionRef: response.transactionRef,
      sessionId: response.sessionId,
      status: response.status,
      amount: amount,
      sender: response.sender,
      recipient: response.recipient,
      timestamp: response.timestamp,
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionsByAccount = async (req, res, next) => {
  try {
    const { accountId } = req.user;

    // 2. Call Service
    const transactions =
      await transactionService.fetchTransactionsByAccount(accountId);

    // 3. Response
    return res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionByReference = async (req, res, next) => {
  try {
    const { id } = req.params;

    const transactionData =
      await transactionService.fetchTransactionByRefeference(id);

    return res.status(200).json({
      success: true,
      messasge: "Transaction fetched successfully",
      data: transactionData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  transferMoney,
  getTransactionsByAccount,
  getTransactionByReference,
};
