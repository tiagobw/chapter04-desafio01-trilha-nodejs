import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Find User by Id", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to find a user by id", async () => {
    const { id } = await createUserUseCase.execute({
      name: "John Doe",
      email: "john@doe.com",
      password: "123456",
    });

    let user;

    if (id) {
      user = await showUserProfileUseCase.execute(id);
    }

    expect(user).toHaveProperty("id");
  });

  it("should throw an error if the user is not found", async () => {
    const id = "idThatDoesNotExist";

    await expect(showUserProfileUseCase.execute(id)).rejects.toEqual(
      new ShowUserProfileError()
    );
  });
});
