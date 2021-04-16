import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";

describe("Autehticate User Controller", () => {
  let database: Connection;

  beforeAll(async () => {
    database = await createConnection();
    await database.runMigrations();
  });

  afterAll(async () => {
    await database.dropDatabase();
    await database.close();
  });

  it("should be able to autheticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "User Admin",
      email: "testAdmin@mail.com",
      password: "12345",
    };
    await request(app).post("/api/v1/users").send(user);

    const response = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password,
    });

    expect(response.body).toHaveProperty("token");
    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user).not.toHaveProperty("password");
    expect(response.body.user.name).toEqual(user.name);
    expect(response.body.user.email).toEqual(user.email);
  });
  it("should not be able to autheticate with with incorrect password", async () => {
    const user: ICreateUserDTO = {
      name: "User",
      email: "test@mail.com",
      password: "12345",
    };
    const response = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: "password-incorrect",
    });

    expect(response.status).toBe(401);
  });
});
