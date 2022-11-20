import mysql from "mysql2/promise";
import { GameRecord } from "./gameRecoed";

export class GameGeteway {
  async findLatest(conn: mysql.Connection): Promise<GameRecord | undefined> {
    const gameSelectResult = await conn.execute<mysql.RowDataPacket[]>(
      "select id, started_at from games order by id desc limit 1"
    );
    const record = gameSelectResult[0][0];

    if (!record) {
      return undefined;
    }

    return new GameRecord(record["id"], record["started_at"]);
  }

  async insert(conn: mysql.Connection, startedAT: Date): Promise<GameRecord> {
    const gameInsertResult = await conn.execute<mysql.ResultSetHeader>(
      "insert into games (started_at) values (?)",
      [startedAT]
    );
    const gameId = gameInsertResult[0].insertId;

    return new GameRecord(gameId, startedAT);
  }
}
