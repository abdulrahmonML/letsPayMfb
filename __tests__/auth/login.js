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
  };
});

describe("POST /api/auth/login", () => {
  beforeAll(async () => {
    const validUser = {
      name: { firstName: "John", lastName: "Doe" },
      email: "jane@test.com",
      password: "password123",
      phone: "08012345678",
      dob: "1995-01-01",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(validUser);

    loginUserCredentials = {
      email: "jane@test.com",
      password: "password123",
    };
  });

  it("should login a user with valid credentials successfully", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send(loginUserCredentials);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.token).toBeDefined();
  });

  it("should not accept login with a wrong password", async () => {
    const invalidLoginUser = {
      email: "jane@test.com",
      password: "wrongpassword",
    };

    const response = await request(app)
      .post("/api/auth/login")
      .send(invalidLoginUser);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBeDefined();
  });

  it("should not accept missing email or password", async () => {
    const missingData = {
      email: "",
      password: "",
    };

    const response = await request(app)
      .post("/api/auth/login")
      .send(missingData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBeDefined();
  });
});
