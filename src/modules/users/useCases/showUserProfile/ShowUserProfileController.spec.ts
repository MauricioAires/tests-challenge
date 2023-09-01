import createConnection from "../../../../database";
import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("ShowUserProfileController", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show the user profile", async () => {
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
      .get("/api/v1/profile")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: user.name,
      email: user.email,
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });
});
