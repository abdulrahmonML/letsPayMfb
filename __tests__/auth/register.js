const request = require("supertest");
const app = require("../../src/app");

// Mock the entire nibssService module
jest.mock("../../src/services/nibssService", () => {
  console.log("NIBSS SERVICE MOCK IS ACTIVE");
  return {
    createAccount: jest.fn().mockResolvedValue({
      account: {
        accountNumber: "2805632115",
        balance: 0,
        bankCode: "280",
      },
    }),
    insertNin: jest.fn().mockResolvedValue({
      response: {
        nin: "91223567824",
        bankCode: "280",
      },
    }),
  };
});

describe("POST /api/auth/register", () => {
  const validUser = {
    name: { firstName: "John", lastName: "Doe" },
    email: "jane@test.com",
    password: "password123",
    phone: "08012345678",
    dob: "1995-01-01",
  };

  it("should register a new user successfully", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(validUser);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBeDefined();
  });

  it("should not register a user with an existing email", async () => {
    // register once
    await request(app).post("/api/auth/register").send(validUser);

    // try to register again with same email
    const response = await request(app)
      .post("/api/auth/register")
      .send(validUser);

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it("should not register a user with missing fields", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "john@test.com" }); // missing password, name, phone

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
