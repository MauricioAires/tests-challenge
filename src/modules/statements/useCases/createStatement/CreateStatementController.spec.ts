import createConnection from "../../../../database";
import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("CreateStatementController", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create deposit", async () => {
    const user = {
      name: "Mauricio",
      email: "test@gmail.com",
      password: "admin",
    };

    await request(app).post("/api/v1/users").send(user);

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password,
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Description deposit",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.body).toMatchObject({
      amount: 100,
      created_at: expect.any(String),
      description: "Description deposit",
      id: expect.any(String),
      type: "deposit",
      updated_at: expect.any(String),
      user_id: expect.any(String),
    });
  });

  it("should be able to create withdraw", async () => {
    const user = {
      name: "Mauricio",
      email: "test@gmail.com",
      password: "admin",
    };

    await request(app).post("/api/v1/users").send(user);

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password,
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "Description withdraw",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.body).toMatchObject({
      amount: 100,
      created_at: expect.any(String),
      description: "Description withdraw",
      id: expect.any(String),
      type: "withdraw",
      updated_at: expect.any(String),
      user_id: expect.any(String),
    });
  });
});
