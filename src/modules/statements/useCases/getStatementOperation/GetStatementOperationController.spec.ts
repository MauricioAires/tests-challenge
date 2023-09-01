import createConnection from "../../../../database";
import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("GetStatementOperationController", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to realize deposit", async () => {
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

  it("should be able to realize withdraw", async () => {
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

    // Criar depositor para ter valor para sacar
    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Description deposit",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

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

  it("should not be able to realize deposit if user does not exists", async () => {
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

    /**
     * NOTE: Excluir usuário para gerar o erro
     */
    await connection.query(`DELETE FROM users WHERE email = '${user.email}'`);

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
      message: "User not found",
    });
    expect(response.status).toBe(404);
  });

  it("should not be able to realize withdraw if user has not founds", async () => {
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
        amount: 1000,
        description: "Description deposit",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.body).toMatchObject({
      message: "Insufficient funds",
    });
    expect(response.status).toBe(400);
  });
});
