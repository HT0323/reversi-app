import express from "express";
import { DARK, LIGHT } from "../application/constants";
import { TurnService } from "../application/turnService";
import { connectMySql } from "../dataaccess/connection";
import { GameGeteway } from "../dataaccess/gameGeteway";
import { MoveGateway } from "../dataaccess/moveGateway";
import { SquareGateway } from "../dataaccess/squareGateway";
import { TurnGateway } from "../dataaccess/turnGatewat";

export const turnRouter = express.Router();
const turnService = new TurnService();

const gameGeteway = new GameGeteway();
const turnGateway = new TurnGateway();
const moveGateway = new MoveGateway();
const squareGateway = new SquareGateway();

turnRouter.get("/api/games/latest/turns/:turnCount", async (req, res) => {
  const turnCount = parseInt(req.params.turnCount);

  const output = await turnService.findLatestGameTurnByTurnCount(turnCount);
  res.json(output);
});

turnRouter.post("/api/games/latest/turns", async (req, res) => {
  const turnCount = parseInt(req.body.turnCount);
  const disc = parseInt(req.body.move.disc);
  const x = parseInt(req.body.move.x);
  const y = parseInt(req.body.move.y);

  await turnService.registerTurn(turnCount, disc, x, y);

  res.status(201).end();
});
