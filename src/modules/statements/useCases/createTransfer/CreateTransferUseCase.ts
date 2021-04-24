import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransferRepository } from "../../repositories/ITransfersRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("TransfersRepository")
    private transfersRepository: ITransferRepository
  ) {}

  async execute({ id, amount, description, sender_id }: ICreateTransferDTO) {
    enum OperationType {
      DEPOSIT = "deposit",
      WITHDRAW = "withdraw",
      TRANSFER = "transfer",
      TRANSFER_RECEIVED = "transfer_received",
    }

    const senderBalance = await this.statementsRepository.getUserBalance({
      user_id: `${sender_id}`,
    });

    if (senderBalance.balance < amount) {
      throw new CreateStatementError.InsufficientFunds();
    }

    const sendTransfer = await this.transfersRepository.create({
      id,
      amount,
      description,
      sender_id,
    });

    const withdraw = await this.statementsRepository.create({
      user_id: `${sender_id}`,
      amount,
      description,
      type: OperationType.TRANSFER,
      transfer_id: sendTransfer.transfer_id,
    });

    const deposit = await this.statementsRepository.create({
      user_id: `${id}`,
      amount,
      description,
      type: OperationType.TRANSFER_RECEIVED,
      transfer_id: sendTransfer.transfer_id,
    });

    return sendTransfer;
  }
}
