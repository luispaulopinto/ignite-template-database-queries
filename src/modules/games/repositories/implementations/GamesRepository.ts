import { getRepository, Like, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder()
      .where("title ILIKE :title", { title: `%${param}%` })
      .getMany();

    // *********** OR ***********

    // return this.repository.query(
    //   `
    //     SELECT
    //      "id",
    //      "title",
    //      "created_at",
    //      "updated_at"
    //     FROM
    //      "games" "Game"
    //     WHERE
    //       title ILIKE '%' || $1 || '%'
    // `,
    //   [param]
    // );
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(
      `
      SELECT
        COUNT(title) AS "count"
      FROM
        "games" "Game"
    `
    );
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder("games")
      .relation(Game, "users")
      .of(id)
      .loadMany();
  }
}
