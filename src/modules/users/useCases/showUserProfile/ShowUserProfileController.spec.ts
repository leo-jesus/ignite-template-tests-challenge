import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";

describe("Show user profile controller", () => {
  let database: Connection;
  beforeAll(async () => {
    database = await createConnection();
    await database.runMigrations();
  });

  afterAll(async () => {
    await database.dropDatabase();
    await database.close();
  });

  it("should be able to get a information of an authenticate user", async () => {
    const user: ICreateUserDTO = {
      name: "User test",
      email: "test@mail.com",
      password: "12345",
    };
    await request(app).post("/api/v1/users").send(user);

    const createUser = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password,
    });

    const { sessionUser, token } = createUser.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });
    expect(response.body).toHaveProperty("id");
    expect(response.body).not.toHaveProperty("password");
    expect(response.body.name).toEqual(user.name);
    expect(response.body.email).toEqual(user.email);
    expect(response.body.password).not.toEqual(user.password);
  });
  it("shouldn't be able to get an user profile without a valid id", async () => {
    const response = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer invalid-token`,
    });
    expect(response.status).toBe(401);
  });
});
