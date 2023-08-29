import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("CreateUserUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const response = await createUserUseCase.execute({
      email: "user@example.com",
      name: "User Name",
      password: "12345",
    });

    expect(response).toMatchObject({
      email: expect.any(String),
      id: expect.any(String),
      name: expect.any(String),
      password: expect.any(String),
    });
  });

  it("should not be able to create a new user if name already exists", async () => {
    expect(async () => {
      const user = {
        email: "user@example.com",
        name: "User Name",
        password: "12345",
      };
      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
