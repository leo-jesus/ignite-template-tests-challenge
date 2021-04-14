import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      name: "User test",
      email: "test@mail.com",
      password: "12345",
    };

    await createUserUseCase.execute(user);

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

    expect(userCreated).toHaveProperty("id");
  });

  it("Shouldn't be able to create a user with an existend email", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "User test2",
        email: "test2@mail.com",
        password: "12345",
      };
      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
