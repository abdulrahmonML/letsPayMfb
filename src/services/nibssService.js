// ALL NIBSS API CALLS

const nibssRequest = require("../config/nibss");

// in nibssService.js
const axios = require("axios");

const nibssPublicRequest = () => {
  return axios.create({
    baseURL: process.env.NIBSS_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const insertBvn = async (bvn, firstName, lastName, dob) => {
  const client = nibssPublicRequest(); // no token
  const response = await client.post("/api/insertBvn", {
    BVN: bvn,
    firstName,
    lastName,
    dob,
  });
  return response.data;
};

const insertNin = async (nin, firstName, lastName, dob) => {
  const client = await nibssPublicRequest();

  const response = await client.post("/api/insertNin", {
    nin,
    firstName,
    lastName,
    dob,
  });

  return response.data;
};

const createAccount = async (kycType, kycID, dob) => {
  const nibssApi = await nibssRequest();

  const response = await nibssApi.post("/api/account/create", {
    kycType,
    kycID,
    dob,
  });

  return response.data;
};

const nameEnquiry = async (accountNumber) => {
  const nibssApi = await nibssRequest();

  const response = await nibssApi.get(
    `/api/account/name-enquiry/${accountNumber}`,
  );

  return response.data;
};

const transfer = async (from, to, amount) => {
  const nibssApi = await nibssRequest();

  const response = await nibssApi.post("/api/transfer", {
    from,
    to,
    amount,
  });

  return response.data;
};

const getBalance = async (accountNumber) => {
  const nibssApi = await nibssRequest();

  const response = await nibssApi.get(`/api/account/balance/${accountNumber}`);

  return response.data;
};

const validateBvn = async (bvn) => {
  const nibssApi = await nibssRequest();

  const response = await nibssApi.post("/api/validateBvn", {
    bvn,
  });

  return response.data;
};

const validateNin = async (nin) => {
  const nibssApi = await nibssRequest();

  const response = await nibssApi.post("/api/validateNin", {
    nin,
  });

  return response.data;
};

const getTransactionStatus = async (transactionId) => {
  const nibssApi = await nibssRequest();

  const response = await nibssApi.get(`/api/transaction/${transactionId}`);

  return response.data;
};

module.exports = {
  /* insertBvn, */
  insertNin,
  createAccount,
  nameEnquiry,
  transfer,
  getBalance,
  validateBvn,
  validateNin,
  getTransactionStatus,
};
