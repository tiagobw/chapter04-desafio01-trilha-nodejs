import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

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
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get the statement", async () => {
    const user = await createUserUseCase.execute({
      name: "Robert Clark",
      email: "robert@clark.com",
      password: "123456",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "1000 dollars deposit",
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id!,
      statement_id: statement.id!,
    });

    expect(statementOperation).toHaveProperty("id");
  });

  it("should not be able to get the statement if the user is not found", async () => {
    const user = await createUserUseCase.execute({
      name: "Christina Evans",
      email: "christina@evans.com",
      password: "123456",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "1000 dollars deposit",
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: "userIdThatDoesNotExist",
        statement_id: statement.id!,
      })
    ).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });

  it("should not be able to get the statement if the statement operation is not found", async () => {
    const user = await createUserUseCase.execute({
      name: "Paul Ortiz",
      email: "paul@ortiz.com",
      password: "123456",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "1000 dollars deposit",
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: user.id!,
        statement_id: 'statementIdThatDoesNotExist',
      })
    ).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });
});
