import { v4 as uuid } from "uuid";

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../users/entities/User";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

@Entity("transfers")
export class Transfer {
  @PrimaryGeneratedColumn("uuid")
  transfer_id?: string;

  @Column("uuid")
  id?: string;

  @ManyToOne(() => User, (user) => user.statement)
  @JoinColumn({ name: "id" })
  user: User;

  @Column("uuid")
  sender_id: string;

  @ManyToOne(() => User, (user) => user.statement)
  @JoinColumn({ name: "sender_id" })
  sender: User;

  @Column()
  description: string;

  @Column("decimal", { precision: 5, scale: 2 })
  amount: number;

  @Column({ default: OperationType.TRANSFER })
  type: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
    if (!this.transfer_id) {
      this.transfer_id = uuid();
    }
    if (!this.type) {
      this.type = OperationType.TRANSFER;
    }
  }
}
