import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("GetBalanceUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able get statement balance", async () => {
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

    const response = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(response).toMatchObject({
      balance: 100,
      statement: [
        {
          amount: 100,
          description: "Description Test",
          id: expect.any(String),
          type: "deposit",
          user_id: expect.any(String),
        },
      ],
    });
  });

  it("should not be able get statement balance if user does not exists", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "user_not_found",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
