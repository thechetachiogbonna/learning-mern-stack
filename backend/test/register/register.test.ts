import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";

vi.mock("../../src/utils/sendEmail.js", () => ({
  default: vi.fn().mockResolvedValue({ success: true })
}));

import app from "../../src/index.js";
import sendEmail from "../../src/utils/sendEmail.js";

let mongoServer: MongoMemoryServer;

beforeEach(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  vi.clearAllMocks();

  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe("Register", () => {
  const userData = {
    email: "testuser@example.com",
    password: "password123",
    confirmPassword: "password123"
  };

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(userData);
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("email", userData.email);
    expect(res.body).not.toHaveProperty("password");
    expect(res.body._id).toBeDefined();
  });

  it ("should send verification email", async () => {
    const res = await request(app).post("/api/auth/register").send(userData);

    console.log("Response status:", res.status);
    console.log("Response body:", res.body);
    
    expect(res.status).toBe(201);
    expect(vi.mocked(sendEmail)).toHaveBeenCalled()
  })
  
  // it("should set auth cookies", async () => {
  //   const res = await request(app).post("/api/auth/register").send(userData);
    
  //   expect(res.headers.accessToken).toBeDefined()
  // })
});