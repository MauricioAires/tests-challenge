import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("AuthenticateUserUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able authenticate user", async () => {
    await inMemoryUsersRepository.create({
      email: "test@gmail.com",
      name: "Test Name",
      password: await hash("12345", 8),
    });

    const response = await authenticateUserUseCase.execute({
      email: "test@gmail.com",
      password: "12345",
    });

    expect(response).toMatchObject({
      token: expect.any(String),
      user: {
        email: expect.any(String),
        id: expect.any(String),
        name: expect.any(String),
      },
    });
  });
});
