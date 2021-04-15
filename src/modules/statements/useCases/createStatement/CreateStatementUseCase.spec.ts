import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create statement", () => {
  enum OperationType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
  }
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementRepository
    );
  });

  it("should be able do create a new deposit statment", async () => {
    const userTest: ICreateUserDTO = {
      name: "User test",
      email: "test@mail.com",
      password: "12345",
    };
    const user = await createUserUseCase.execute(userTest);

    const statementTest: ICreateStatementDTO = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "deposit operation",
    };
    const state = await createStatementUseCase.execute(statementTest);

    expect(state).toHaveProperty("id");
    expect(state.user_id).toEqual(user.id);
    expect(state.type).toEqual(OperationType.DEPOSIT);
    expect(state.amount).toEqual(statementTest.amount);
    expect(state.description).toEqual(statementTest.description);
  });
  it("Shouldn't be able to create a  statement to a non existent user", async () => {
    expect(async () => {
      const statementTest: ICreateStatementDTO = {
        user_id: " ",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "deposit operation",
      };
      await createStatementUseCase.execute(statementTest);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Shouldn't be able to withdraw a amount grander than amount in account", async () => {
    const userTest: ICreateUserDTO = {
      name: "User test",
      email: "test@mail.com",
      password: "12345",
    };
    expect(async () => {
      const user = await createUserUseCase.execute(userTest);
      const statementTest: ICreateStatementDTO = {
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 1000,
        description: "withdraw operation",
      };
      await createStatementUseCase.execute(statementTest);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
