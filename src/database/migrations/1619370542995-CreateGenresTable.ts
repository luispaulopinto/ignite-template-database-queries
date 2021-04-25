import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGenresTable1619370542995 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        CREATE TABLE "genres"
        (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "description" character varying NOT NULL,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_GenresId" PRIMARY KEY ("id")
        )
      `
    );

    await queryRunner.query(
      `
        CREATE TABLE "genres_games"
        (
          "genresId" uuid NOT NULL,
          "gamesId" uuid NOT NULL,
          CONSTRAINT "PK_Genres_Games" PRIMARY KEY ("genresId", "gamesId")
        )
      `
    );
    await queryRunner.query(
      `
        CREATE INDEX "IDX_Genres_Games_GenresID" 
          ON "genres_games" ("genresId")
      `
    );
    await queryRunner.query(
      `
        CREATE INDEX "IDX_Genres_Games_GamesID"
          ON "genres_games" ("gamesId")
      `
    );

    await queryRunner.query(
      `
        ALTER TABLE
          "genres_games"
        ADD CONSTRAINT
          "PK_Genres_Games_GenresId" FOREIGN KEY ("genresId")
        REFERENCES
          "genres"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
      `
    );

    await queryRunner.query(
      `
        ALTER TABLE
          "genres_games"
        ADD CONSTRAINT
          "PK_Genres_Games_GamesId" FOREIGN KEY ("gamesId")
        REFERENCES
          "games"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "genres_games" DROP CONSTRAINT "PK_Genres_Games_GenresId"'
    );
    await queryRunner.query(
      'ALTER TABLE "genres_games" DROP CONSTRAINT "PK_Genres_Games_GamesId"'
    );
    await queryRunner.query('DROP INDEX "IDX_Genres_Games_GenresID"');
    await queryRunner.query('DROP INDEX "IDX_Genres_Games_GamesID"');
    await queryRunner.query('DROP TABLE "genres_games"');
    await queryRunner.query('DROP TABLE "genres"');
  }
}
