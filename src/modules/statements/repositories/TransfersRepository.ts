import { getRepository, Repository } from "typeorm";
import { Transfer } from "../entities/Transfer";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";
import { ITransferRepository } from "./ITransfersRepository";

export class TransfersRepository implements ITransferRepository {
  private repository: Repository<Transfer>;

  constructor() {
    this.repository = getRepository(Transfer);
  }

  async create({
    id,
    amount,
    description,
    sender_id,
    transfer_id,
  }: ICreateTransferDTO): Promise<Transfer> {
    const transfer = this.repository.create({
      id,
      amount,
      description,
      sender_id,
      transfer_id,
    });

    return this.repository.save(transfer);
  }
}
