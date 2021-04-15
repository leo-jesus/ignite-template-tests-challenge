import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get balance", () => {
  enum OperationType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
  }

  inMemoryUsersRepository = new InMemoryUsersRepository();
  inMemoryStatementsRepository = new InMemoryStatementsRepository();
  getStatementOperationUseCase = new GetStatementOperationUseCase(
    inMemoryUsersRepository,
    inMemoryStatementsRepository
  );
  createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  createStatementUseCase = new CreateStatementUseCase(
    inMemoryUsersRepository,
    inMemoryStatementsRepository
  );

  it("Should be able to get statement of operations of account ", async () => {
    const userTest: ICreateUserDTO = {
      name: "User test",
      email: "test@mail.com",
      password: "12345",
    };
    const user = await createUserUseCase.execute(userTest);

    const deposit: ICreateStatementDTO = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 90,
      description: "deposit operation",
    };

    const state = await createStatementUseCase.execute(deposit);

    const operations = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: state.id as string,
    });
    expect(operations).toHaveProperty("id");
    expect(operations).toHaveProperty("user_id");
    expect(operations.type).toBe(state.type);
    expect(operations.amount).toBe(state.amount);
    expect(operations.description).toBe(state.description);
  });

  it("shouldn't be able to get a statement of a non existent user", async () => {
    await expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "user",
        statement_id: "id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("shouldn't be able to get a statement if not exists", async () => {
    const userTest: ICreateUserDTO = {
      name: "User",
      email: "testUser@mail.com",
      password: "12345",
    };
    const user = await createUserUseCase.execute(userTest);

    const deposit: ICreateStatementDTO = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 90,
      description: "deposit operation",
    };
    await createStatementUseCase.execute(deposit);

    await expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
