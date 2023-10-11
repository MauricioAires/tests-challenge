import { inject, injectable } from "tsyringe";
import { ICreateTransferDTO } from "./ICreateTransferDTO";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";
import { OperationType } from "../../entities/Statement";

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    user_id,
    amount,
    description,
    sender_id,
  }: ICreateTransferDTO) {
    if (user_id === sender_id) {
      throw new CreateTransferError.UserNotFound();
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new CreateTransferError.UserNotFound();
    }

    const senderUser = await this.usersRepository.findById(sender_id);

    if (!senderUser) {
      throw new CreateTransferError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
    });

    if (balance < amount) {
      throw new CreateTransferError.InsufficientFunds();
    }

    // Register transfer on sender user
    await this.statementsRepository.create({
      sender_id,
      user_id,
      type: OperationType.TRANSFER,
      amount,
      description,
    });

    const statementOperation = await this.statementsRepository.create({
      user_id: sender_id,
      type: OperationType.WITHDRAW,
      amount,
      description: `Transferência para ${senderUser.name}`,
    });

    return statementOperation;
  }
}
