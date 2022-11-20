import express from "express";
import "express-async-errors";

import { GameGeteway } from "../dataaccess/gameGeteway";
import { TurnGateway } from "../dataaccess/turnGatewat";
import { SquareGateway } from "../dataaccess/squareGateway";
import { connectMySql } from "../dataaccess/connection";
import { DARK, INITIAL_BOARD } from "../application/constants";

export const gameRouter = express.Router();

const gameGeteway = new GameGeteway();
const turnGateway = new TurnGateway();
const squareGateway = new SquareGateway();

gameRouter.post("/api/games", async (req, res) => {
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

  res.status(201).end();
});
