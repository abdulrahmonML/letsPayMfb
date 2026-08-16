// ALL NIBSS API CALLS

import { nibssRequest, nibssPublicRequest } from "../config/nibss";

interface NibssAccount {
  accountNumber: string;
  balance: number;
  bankCode: string;
}

export interface NibssCreateAccountResponse {
  account: NibssAccount;
}

export interface NibssNameEnquiryResponse {
  accountNumber: string;
  accountName: string;
  bank: string;
}

export interface NibssTransferResponse {
  status: "SUCCESS" | "FAILED";
  reference: string;
}

export interface NibssBalanceResponse {
  balance: number;
}

interface NibssTransactionStatusResponse {
  status: string;
}

interface NibssGenericResponse {
  success: boolean;
  message?: string;
}

const insertNin = async (
  nin: string,
  firstName: string,
  lastName: string,
  dob: string,
): Promise<NibssGenericResponse> => {
  const client = await nibssPublicRequest();

  const response = await client.post("/api/insertNin", {
    nin,
    firstName,
    lastName,
    dob,
  });

  return response.data;
};

const createAccount = async (
  kycType: string,
  kycID: string,
  dob: string,
): Promise<NibssCreateAccountResponse> => {
  const nibssApi = await nibssRequest();

  const response = await nibssApi.post("/api/account/create", {
    kycType,
    kycID,
    dob,
  });

  return response.data;
};

const nameEnquiry = async (
  accountNumber: string,
): Promise<NibssNameEnquiryResponse> => {
  const nibssApi = await nibssRequest();

  const response = await nibssApi.get(
    `/api/account/name-enquiry/${accountNumber}`,
  );

  return response.data;
};

const transfer = async (
  from: string,
  to: string,
  amount: number,
): Promise<NibssTransferResponse> => {
  const nibssApi = await nibssRequest();

  const response = await nibssApi.post("/api/transfer", {
    from,
    to,
    amount,
  });

  return response.data;
};

const getBalance = async (
  accountNumber: string,
): Promise<NibssBalanceResponse> => {
  const nibssApi = await nibssRequest();

  const response = await nibssApi.get(`/api/account/balance/${accountNumber}`);

  return response.data;
};

const validateBvn = async (bvn: string): Promise<NibssGenericResponse> => {
  const nibssApi = await nibssRequest();

  const response = await nibssApi.post("/api/validateBvn", {
    bvn,
  });

  return response.data;
};

const validateNin = async (nin: string): Promise<NibssGenericResponse> => {
  const nibssApi = await nibssRequest();

  const response = await nibssApi.post("/api/validateNin", {
    nin,
  });

  return response.data;
};

const getTransactionStatus = async (
  transactionId: string,
): Promise<NibssTransactionStatusResponse> => {
  const nibssApi = await nibssRequest();

  const response = await nibssApi.get(`/api/transaction/${transactionId}`);

  return response.data;
};

export {
  insertNin,
  createAccount,
  nameEnquiry,
  transfer,
  getBalance,
  validateBvn,
  validateNin,
  getTransactionStatus,
};
