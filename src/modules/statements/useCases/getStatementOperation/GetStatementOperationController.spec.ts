import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";

describe("get statement operation controller", () => {
  enum OperationType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
  }

  let database: Connection;

  beforeAll(async () => {
    database = await createConnection();
    await database.runMigrations();
  });
  afterAll(async () => {
    await database.dropDatabase();
    await database.close();
  });

  it("Should be able to get statement of operations of account", async () => {
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
    const deposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 200,
        description: "deposit test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    const response = await request(app)
      .get(`/api/v1/statements/${deposit.body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("user_id");
    expect(response.body.type).toBe(OperationType.DEPOSIT);
    expect(response.body.amount).toBe("200.00");
    expect(response.body.description).toBe(deposit.body.description);
  });

  it("Shouldn't be able to get statement of operations of account", async () => {
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
    const deposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 200,
        description: "deposit test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    const response = await request(app)
      .get(`/api/v1/statements/${deposit.body.id}`)
      .set({
        Authorization: `Bearer ${token}-invalid`,
      });

    expect(response.status).toBe(401);
  });
  it("Should not be able to get statement with statement not exist", async () => {
    const response = await request(app)
      .get(`/api/v1/statements/invalid-id}`)
      .set({
        Authorization: `Bearer invalid-token`,
      });

    expect(response.status).toBe(401);
  });
});
