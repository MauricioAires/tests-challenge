import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("CreateStatementUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a new statement", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "test@gmal.com",
      name: "Test Name",
      password: "12345",
    });

    const response = await createStatementUseCase.execute({
      amount: 100,
      description: "Description Teste",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    expect(response).toMatchObject({
      amount: 100,
      description: "Description Teste",
      id: expect.any(String),
      type: "deposit",
      user_id: expect.any(String),
    });
  });

  it("should not be able to create a new statement if user not found", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 100,
        description: "Description Teste",
        type: OperationType.DEPOSIT,
        user_id: "user_not_found",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to withdraw if user hasn't founds", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: "test@gmal.com",
        name: "Test Name",
        password: "12345",
      });

      await createStatementUseCase.execute({
        amount: 100,
        description: "Description Teste",
        type: OperationType.WITHDRAW,
        user_id: user.id as string,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
