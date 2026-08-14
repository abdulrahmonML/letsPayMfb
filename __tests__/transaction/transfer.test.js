const request = require("supertest");
const app = require("../../src/app");

// Mock nibssService with all four functions
jest.mock("../../src/services/nibssService", () => ({
  createAccount: jest
    .fn()
    .mockResolvedValueOnce({
      account: { accountNumber: "2805632111", balance: 0, bankCode: "280" },
    })
    .mockResolvedValueOnce({
      account: { accountNumber: "2805632222", balance: 0, bankCode: "280" },
    }),
  insertNin: jest
    .fn()
    .mockResolvedValueOnce({
      response: { nin: "91223560001", bankCode: "280" },
    })
    .mockResolvedValueOnce({
      response: { nin: "91223560002", bankCode: "280" },
    }),
  nameEnquiry: jest.fn().mockResolvedValue({
    accountNumber: "2805632222",
    accountName: "Jane Doe",
    bankCode: "280",
    // what shape does nameEnquiry return in your service?
    // look at how validBeneficiary is used:
    // validBeneficiary.accountNumber
    // validBeneficiary.accountName
  }),
  getBalance: jest.fn().mockResolvedValue({
    balance: 15000,
  }),
  transfer: jest.fn().mockResolvedValue({
    status: "SUCCESS",
    reference: "TXN123456789",
    // what shape does nibssTransfer need?
    // look at how it's used:
    // nibssTransfer.status
    // nibssTransfer.reference
  }),
}));

// Mock email service
jest.mock("../../src/services/emailService", () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

describe("POST /api/transactions/transfer", () => {
  let senderToken;
  let recipientAccountNumber;

  afterEach(() => {
    // override global afterEach — keep data between tests
  });

  afterAll(async () => {
    // manually clean up after all transfer tests
    const mongoose = require("mongoose");
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  beforeAll(async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: { firstName: "John", lastName: "Doe" },
        email: "sender@test.com",
        password: "password123",
        phone: "08012345678",
        dob: "1995-01-01",
      });

    // Login sender — grab token
    const senderLoginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: "sender@test.com", password: "password123" });

    senderToken = senderLoginResponse.body.data.token;

    // Register recipient — grab account number
    const recipientRegister = await request(app)
      .post("/api/auth/register")
      .send({
        name: { firstName: "Jane", lastName: "Doe" },
        email: "recipient@test.com",
        password: "password123",
        phone: "08087654321",
        dob: "1996-05-15",
      });

    const recipientLoginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: "recipient@test.com", password: "password123" });
    const recipientToken = recipientLoginResponse.body.data.token;

    // Fetch recipient account number
    const recipientAccountResponse = await request(app)
      .get("/api/account")
      .set("Authorization", `Bearer ${recipientToken}`);
    recipientAccountNumber = recipientAccountResponse.body.data.accountNumber;
  });

  it("should transfer successfully", async () => {
    const response = await request(app)
      .post("/api/transactions/transfer")
      .set("Authorization", `Bearer ${senderToken}`)
      .send({
        to: recipientAccountNumber,
        amount: 1000,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
  // 1. register sender
  // 2. login sender → grab senderToken
  // 3. register recipient → grab recipientAccountNumber

  // write your tests here
});
