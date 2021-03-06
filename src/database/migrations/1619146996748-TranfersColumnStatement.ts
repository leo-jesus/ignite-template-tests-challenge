import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class TranfersColumnStatement1619146996748
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "statements",
      new TableColumn({
        name: "transfer_id",
        type: "uuid",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("statements", "transfer_id");
  }
}
