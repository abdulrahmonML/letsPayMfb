const request = require("supertest");
const app = require("../../src/app");

jest.mock("../../src/services/nibssService", () => {
  console.log("NIBSS SERVICE MOCK IS ACTIVE");
  return {
    createAccount: jest.fn().mockResolvedValue({
      account: {
        accountNumber: "2805635555",
        balance: 0,
        bankCode: "280",
      },
    }),
    insertNin: jest.fn().mockResolvedValue({
      response: {
        nin: "91223565555",
        bankCode: "280",
      },
    }),
    getBalance: jest.fn().mockResolvedValue({
      balance: 15000,
    }),
  };
});
describe("GET /api/account", () => {
  let token;

  beforeEach(async () => {
    // register user
    await request(app)
      .post("/api/auth/register")
      .send({
        name: { firstName: "John", lastName: "Doe" },
        email: "john@test.com",
        password: "password123",
        phone: "08012345678",
        dob: "1995-01-01",
      });

    // login and grab token
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: "john@test.com", password: "password123" });

    token = loginResponse.body.data.token;
  });

  it("should fetch account details successfully", async () => {
    const response = await request(app)
      .get("/api/account")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.accountNumber).toBeDefined();
    expect(response.body.data.balance).toBeDefined();
  });

  it("should not fetch account details without a token", async () => {
    const response = await request(app).get("/api/account");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should not fetch account details with an invalid token", async () => {
    const response = await request(app)
      .get("/api/account")
      .set("Authorization", "Bearer invalidtoken");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
