import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

describe("Create statement controller", () => {
  let database: Connection;

  beforeAll(async () => {
    database = await createConnection();
    await database.runMigrations();
  });

  enum OperationType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
  }

  afterAll(async () => {
    await database.dropDatabase();
    await database.close();
  });
  it("should be able do create a new deposit statment", async () => {
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
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "deposit test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it("Shouldn't be able to create a  statement to a non existent user", async () => {
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "deposit test",
      })
      .set({
        Authorization: `Bearer invalid-token`,
      });

    expect(response.status).toBe(401);
  });
});
