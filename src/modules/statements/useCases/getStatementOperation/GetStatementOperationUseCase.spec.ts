import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("GetStatementOperationUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able get statement operation", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "test@gmal.com",
      name: "Test Name",
      password: "12345",
    });

    const statement = await inMemoryStatementsRepository.create({
      amount: 100,
      description: "Description Test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    const response = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(response).toMatchObject({
      amount: 100,
      description: "Description Test",
      id: expect.any(String),
      type: "deposit",
      user_id: user.id,
    });
  });

  it("should not be able get statement operation if user does not exists", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: "test@gmal.com",
        name: "Test Name",
        password: "12345",
      });

      const statement = await inMemoryStatementsRepository.create({
        amount: 100,
        description: "Description Test",
        type: OperationType.DEPOSIT,
        user_id: user.id as string,
      });

      await getStatementOperationUseCase.execute({
        user_id: "user_not_found",
        statement_id: statement.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
  it("should not be able get statement operation if statement does not exists", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: "test@gmal.com",
        name: "Test Name",
        password: "12345",
      });

      await inMemoryStatementsRepository.create({
        amount: 100,
        description: "Description Test",
        type: OperationType.DEPOSIT,
        user_id: user.id as string,
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "statement_not_found",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
