enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
  TRANSFER_RECEIVED = "transfer_received",
}
export type ICreateStatementDTO = {
  user_id: string;
  description: string;
  amount: number;
  type: OperationType;
  transfer_id?: string;
};
