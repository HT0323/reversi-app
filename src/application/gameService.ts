import { connectMySql } from "../dataaccess/connection";
import { GameGeteway } from "../dataaccess/gameGeteway";
import { SquareGateway } from "../dataaccess/squareGateway";
import { TurnGateway } from "../dataaccess/turnGatewat";
import { DARK, INITIAL_BOARD } from "./constants";

const gameGeteway = new GameGeteway();
const turnGateway = new TurnGateway();
const squareGateway = new SquareGateway();

export class GameService {
  async startNewGame() {
    const now = new Date();
    const conn = await connectMySql();

    try {
      await conn.beginTransaction();
      const gameRecord = await gameGeteway.insert(conn, now);

      const turnRecord = await turnGateway.insert(
        conn,
        gameRecord.id,
        0,
        DARK,
        now
      );

      await squareGateway.insertAll(conn, turnRecord.id, INITIAL_BOARD);

      await conn.commit();
    } finally {
      await conn.end();
    }
  }
}
