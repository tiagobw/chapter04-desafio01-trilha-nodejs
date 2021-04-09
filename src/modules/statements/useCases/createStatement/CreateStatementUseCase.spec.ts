import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementError } from "./CreateStatementError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a new statement", async () => {
    const user = await createUserUseCase.execute({
      name: "Will Johnson",
      email: "will@johnson.com",
      password: "123456",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "1000 dollars deposit",
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create a statement if the user is not found", async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: 'userIdThatDoesNotExist',
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: "1000 dollars deposit",
      })
    ).rejects.toEqual(new CreateStatementError.UserNotFound());
  });

  it("should not be able to withdraw if the balance is less than the amount", async () => {
    const user = await createUserUseCase.execute({
      name: "Bryan Miller",
      email: "bryan@miller.com",
      password: "123456",
    });

    await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "1000 dollars deposit",
    });

    await expect(
      createStatementUseCase.execute({
        user_id: user.id!,
        type: OperationType.WITHDRAW,
        amount: 1001,
        description: "1001 dollars withdraw",
      })
    ).rejects.toEqual(new CreateStatementError.InsufficientFunds());
  });
});
