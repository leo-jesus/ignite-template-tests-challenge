import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";

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

  it("Should be able to get balace with amount in account", async () => {
    const user: ICreateUserDTO = {
      name: "User test",
      email: "test@mail.com",
      password: "12345",
    };
    const dep = 300;
    const wdraw = 100;
    const balanceAmount = dep - wdraw;
    await request(app).post("/api/v1/users").send(user);

    const createUser = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password,
    });
    const { sessionUser, token } = createUser.body;
    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: dep,
        description: "deposit test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: wdraw,
        description: "withdraw test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });
    expect(response.body.statement).toHaveLength(2);
    expect(response.body.balance).toBe(balanceAmount);
  });

  it("Should not be able to get balance of an non existent user", async () => {
    const response = await request(app).get("/api/v1/statements/balance").set({
      Authorization: `Bearer invalid-token}`,
    });
    expect(response.status).toBe(401);
  });
});
