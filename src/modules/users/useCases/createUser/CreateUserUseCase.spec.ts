import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Paul Watson",
      email: "paul@watson.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a user if the email is already in use", async () => {
    await createUserUseCase.execute({
      name: "Francis Davis",
      email: "francis@davis.com",
      password: "123456",
    });

    await expect(
      createUserUseCase.execute({
        name: "Ethan Green",
        email: "francis@davis.com",
        password: "654321",
      })
    ).rejects.toEqual(new CreateUserError());
  });
});
