import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show users profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to get an user profile", async () => {
    const userAdmin: ICreateUserDTO = {
      name: "User Admin 2 ",
      email: "testAdmin2@mail.com",
      password: "1234",
    };
    const user = await createUserUseCase.execute(userAdmin);

    const getProfile = await showUserProfileUseCase.execute(user.id as string);

    expect(getProfile).toHaveProperty("id");
    expect(getProfile).toHaveProperty("password");
    expect(getProfile.name).toEqual(userAdmin.name);
    expect(getProfile.email).toEqual(userAdmin.email);
    expect(getProfile.password).not.toHaveProperty(userAdmin.password);
  });

  it("shouldn't be able to get an user profile without a valid id", async () => {
    await expect(async () => {
      await showUserProfileUseCase.execute("");
    }).rejects.toBeInstanceOf(AppError);
  });
});
