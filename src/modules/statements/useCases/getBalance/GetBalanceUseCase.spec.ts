import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get balance", () => {
  enum OperationType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
  }

  inMemoryUsersRepository = new InMemoryUsersRepository();
  inMemoryStatementsRepository = new InMemoryStatementsRepository();
  getBalanceUseCase = new GetBalanceUseCase(
    inMemoryStatementsRepository,
    inMemoryUsersRepository
  );
  createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  createStatementUseCase = new CreateStatementUseCase(
    inMemoryUsersRepository,
    inMemoryStatementsRepository
  );

  it("Should be able to get balace with amount in account ", async () => {
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

    const withdraw: ICreateStatementDTO = {
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 50,
      description: "withdraw operation",
    };

    await createStatementUseCase.execute(deposit);
    await createStatementUseCase.execute(withdraw);

    const amount = deposit.amount - withdraw.amount;
    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balance.balance).toBe(amount);
  });

  it("should'nt be able to create get a balance of a non existent user", () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "user",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
