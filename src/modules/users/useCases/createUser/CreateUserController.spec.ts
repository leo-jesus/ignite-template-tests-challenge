import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { ICreateUserDTO } from "./ICreateUserDTO";

describe("Get balance controller", () => {
  let database: Connection;

  beforeAll(async () => {
    database = await createConnection();
    await database.runMigrations();
  });

  afterAll(async () => {
    await database.dropDatabase();
    await database.close();
  });

  it("Should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      name: "User test",
      email: "test@mail.com",
      password: "12345",
    };
    const response = await request(app).post("/api/v1/users").send(user);
    expect(response.status).toBe(201);
  });

  it("Shouldn't be able to create a new user if user already exists", async () => {
    const user: ICreateUserDTO = {
      name: "User test",
      email: "test@mail.com",
      password: "12345",
    };
    const response = await request(app).post("/api/v1/users").send(user);
    expect(response.status).toBe(400);
  });
});
