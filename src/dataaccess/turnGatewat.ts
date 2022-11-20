import { TurnRecord } from "./turnRecord";
import mysql from "mysql2/promise";

export class TurnGateway {
  async findForGameIdAndTurnCount(
    conn: mysql.Connection,
    gameId: number,
    turnCount: number
  ): Promise<TurnRecord | undefined> {
    const turnSelectResult = await conn.execute<mysql.RowDataPacket[]>(
      "select id, game_id, turn_count, next_disc, end_at from turns where game_id = ? and turn_count = ?",
      [gameId, turnCount]
    );
    const record = turnSelectResult[0][0];

    if (!record) {
      return undefined;
    }

    return new TurnRecord(
      record["id"],
      record["game_id"],
      record["turn_count"],
      record["next_disc"],
      record["end_at"]
    );
  }

  async insert(
    conn: mysql.Connection,
    gameId: number,
    turnCount: number,
    nextDisc: number,
    endAt: Date
  ): Promise<TurnRecord> {
    const turnInsertResult = await conn.execute<mysql.ResultSetHeader>(
      "insert into turns (game_id, turn_count, next_disc, end_at) values (?,?,?,?)",
      [gameId, turnCount, nextDisc, endAt]
    );
    const turnId = turnInsertResult[0].insertId;

    return new TurnRecord(turnId, gameId, turnCount, nextDisc, endAt);
  }
}
