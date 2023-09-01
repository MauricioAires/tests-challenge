import createConnection from "../../../../database";
import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("CreateUserController", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const user = {
      name: "Mauricio",
      email: "test@gmail.com",
      password: "admin",
    };

    const response = await request(app).post("/api/v1/users").send(user);

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new user if email already exists", async () => {
    const user = {
      name: "Mauricio",
      email: "test@gmail.com",
      password: "admin",
    };

    await request(app).post("/api/v1/users").send(user);

    const response = await request(app).post("/api/v1/users").send(user);

    expect(response.body).toMatchInlineSnapshot(`
{
  "message": "User already exists",
}
`);

    expect(response.status).toBe(400);
  });
});
