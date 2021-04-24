import { Transfer } from "../entities/Transfer";

import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";

export interface ITransferRepository {
  create(data: ICreateTransferDTO): Promise<Transfer>;
}
