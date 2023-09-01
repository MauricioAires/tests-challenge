import createConnection from "../../../../database";
import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("AuthenticateUserController", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate user", async () => {
    const user = {
      name: "Mauricio",
      email: "test@gmail.com",
      password: "admin",
    };

    await request(app).post("/api/v1/users").send(user);

    const response = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password,
    });

    expect(response.body).toMatchObject({
      token: expect.any(String),
      user: {
        email: user.email,
        id: expect.any(String),
        name: user.name,
      },
    });
  });

  it("should not be able to authenticate user if email is incorrect", async () => {
    const user = {
      name: "Mauricio",
      email: "test@gmail.com",
      password: "admin",
    };

    await request(app).post("/api/v1/users").send(user);

    const response = await request(app).post("/api/v1/sessions").send({
      email: "incorrect_email",
      password: user.password,
    });

    expect(response.body).toMatchObject({
      message: "Incorrect email or password",
    });
    expect(response.status).toBe(401);
  });

  it("should not be able to authenticate user if password is incorrect", async () => {
    const user = {
      name: "Mauricio",
      email: "test@gmail.com",
      password: "admin",
    };

    await request(app).post("/api/v1/users").send(user);

    const response = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: "incorrect_password",
    });

    expect(response.body).toMatchObject({
      message: "Incorrect email or password",
    });
    expect(response.status).toBe(401);
  });
});
