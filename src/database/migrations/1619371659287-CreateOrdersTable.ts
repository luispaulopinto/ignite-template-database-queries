import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrdersTable1619371659287 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE TABLE "orders"
      (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "usersId" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_OrdersId" PRIMARY KEY ("id")
      )
    `
    );

    await queryRunner.query(
      `
      CREATE TABLE "orders_games"
      (
        "ordersId" uuid NOT NULL,
        "gamesId" uuid NOT NULL,
        CONSTRAINT "PK_Orders_Games" PRIMARY KEY ("ordersId", "gamesId")
      )
    `
    );

    await queryRunner.query(
      `
      CREATE INDEX "IDX_Orders_Games_OrdersID" 
        ON "orders_games" ("ordersId")
    `
    );
    await queryRunner.query(
      `
      CREATE INDEX "IDX_Orders_Games_GamesID" 
        ON "orders_games" ("gamesId")
    `
    );

    await queryRunner.query(
      `
      ALTER TABLE
        "orders_games"
      ADD CONSTRAINT
        "PK_Orders_Games_GamesId" FOREIGN KEY ("gamesId")
      REFERENCES
        "games"("id") 
          ON DELETE CASCADE ON UPDATE NO ACTION
    `
    );

    await queryRunner.query(
      `
      ALTER TABLE
        "orders_games"
      ADD CONSTRAINT
        "PK_Orders_Games_OrdersId" FOREIGN KEY ("ordersId")
     REFERENCES
        "orders"("id") 
          ON DELETE CASCADE ON UPDATE NO ACTION
    `
    );

    await queryRunner.query(
      `
      ALTER TABLE
        "orders"
      ADD CONSTRAINT
        "PK_Orders_UsersId" FOREIGN KEY ("usersId")
      REFERENCES
        "users"("id") 
          ON DELETE CASCADE ON UPDATE NO ACTION
    `
    );

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "orders_games" DROP CONSTRAINT "PK_Orders_Games_GamesId"'
    );
    await queryRunner.query(
      'ALTER TABLE "orders_games" DROP CONSTRAINT "PK_Orders_Games_OrdersId"'
    );
    await queryRunner.query(
      'ALTER TABLE "orders" DROP CONSTRAINT "PK_Orders_UsersId"'
    );
    
    await queryRunner.query('DROP INDEX "IDX_Orders_Games_OrdersID"');
    await queryRunner.query('DROP INDEX "IDX_Orders_Games_GamesID"');

    await queryRunner.query('DROP TABLE "orders_games"');
    await queryRunner.query('DROP TABLE "orders"');
  }
}
