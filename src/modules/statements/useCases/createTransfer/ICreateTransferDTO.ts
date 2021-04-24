enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
  TRANSFER_RECEIVED = "transfer_received",
}
export type ICreateTransferDTO = {
  id: string;
  description: string;
  amount: number;
  sender_id: string;
  transfer_id?: string;
};
