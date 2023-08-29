import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("ShowUserProfileUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to show user profile", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "test@gmal.com",
      name: "Test Name",
      password: "12345",
    });

    const response = await showUserProfileUseCase.execute(user.id as string);

    expect(response).toStrictEqual(user);
  });

  it("should not be able to show user profile if user not exists", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("inexistent_id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
