import jwt from "jsonwebtoken";

import authConfig from "../../../../config/auth";
import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  interface IUserToken {
    user: User;
    token: string;
  }

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to autheticate an user", async () => {
    const userAdmin: ICreateUserDTO = {
      name: "User Admin",
      email: "testAdmin@mail.com",
      password: "12345",
    };
    await createUserUseCase.execute(userAdmin);

    const { user, token } = await authenticateUserUseCase.execute({
      email: userAdmin.email,
      password: userAdmin.password,
    });

    const verifyUserToken = jwt.verify(
      token,
      authConfig.jwt.secret
    ) as IUserToken;

    expect(user).toHaveProperty("id");
    expect(user).not.toHaveProperty("password");
    expect(user.name).toEqual(userAdmin.name);
    expect(user.email).toEqual(userAdmin.email);

    expect(verifyUserToken.user).toHaveProperty("id");
    expect(verifyUserToken.user).toHaveProperty("password");
    expect(verifyUserToken.user.name).toEqual(userAdmin.name);
    expect(verifyUserToken.user.email).toEqual(userAdmin.email);
  });
  it("should not to be able to create a session with a non exitent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "false@mail.com",
        password: "4321",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to autheticate with with incorrect password", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "User",
        email: "test@mail.com",
        password: "12345",
      };

      await createUserUseCase.execute(user);
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "IncorrectPassword",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
