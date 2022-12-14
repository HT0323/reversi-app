import { connectMySql } from "../dataaccess/connection";
import { GameGeteway } from "../dataaccess/gameGeteway";
import { MoveGateway } from "../dataaccess/moveGateway";
import { SquareGateway } from "../dataaccess/squareGateway";
import { TurnGateway } from "../dataaccess/turnGatewat";
import { DARK, LIGHT } from "./constants";

const gameGeteway = new GameGeteway();
const turnGateway = new TurnGateway();
const moveGateway = new MoveGateway();
const squareGateway = new SquareGateway();

class FindLatestGameTurnByTurnCountOutput {
  constructor(
    private _turnCount: number,
    private _board: number[][],
    private _nextDisc: number | undefined,
    private _winnerDisc: number | undefined
  ) {}

  get turnCount() {
    return this._turnCount;
  }

  get board() {
    return this._board;
  }

  get nextDisc() {
    return this._nextDisc;
  }

  get winnerDisc() {
    return this._winnerDisc;
  }
}

export class TurnService {
  async findLatestGameTurnByTurnCount(
    turnCount: number
  ): Promise<FindLatestGameTurnByTurnCountOutput> {
    const conn = await connectMySql();

    try {
      const gameRecord = await gameGeteway.findLatest(conn);
      if (!gameRecord) {
        throw new Error("latest game not found");
      }

      const turnRecord = await turnGateway.findForGameIdAndTurnCount(
        conn,
        gameRecord.id,
        turnCount
      );

      if (!turnRecord) {
        throw new Error("Specified turn not found");
      }

      const squareRecords = await squareGateway.findForTurnId(
        conn,
        turnRecord.id
      );

      const board = Array.from(Array(8)).map(() => Array.from(Array(8)));
      squareRecords.forEach((s) => {
        board[s.y][s.x] = s.disc;
      });

      return new FindLatestGameTurnByTurnCountOutput(
        turnCount,
        board,
        turnRecord.nextDisc,
        undefined
      );
    } finally {
      await conn.end();
    }
  }

  async registerTurn(turnCount: number, disc: number, x: number, y: number) {
    const conn = await connectMySql();

    try {
      // ????????????????????????
      const gameRecord = await gameGeteway.findLatest(conn);
      if (!gameRecord) {
        throw new Error("latest game not found");
      }

      const previoustTurnCount = turnCount - 1;
      const previoustTurnRecord = await turnGateway.findForGameIdAndTurnCount(
        conn,
        gameRecord.id,
        previoustTurnCount
      );

      if (!previoustTurnRecord) {
        throw new Error("Specified turn not found");
      }

      const squareRecords = await squareGateway.findForTurnId(
        conn,
        previoustTurnRecord.id
      );

      const board = Array.from(Array(8)).map(() => Array.from(Array(8)));
      squareRecords.forEach((s) => {
        board[s.y][s.x] = s.disc;
      });

      // ????????????????????????????????????
      board[y][x] = disc;

      const now = new Date();
      const nextDisc = disc === DARK ? LIGHT : DARK;

      const turnRecord = await turnGateway.insert(
        conn,
        gameRecord.id,
        turnCount,
        nextDisc,
        now
      );

      await squareGateway.insertAll(conn, turnRecord.id, board);

      await moveGateway.insert(conn, turnRecord.id, disc, x, y);

      await conn.commit();
    } finally {
      await conn.end();
    }
  }
}
