import mysql from "mysql2/promise";

export async function connectMySql(): Promise<mysql.Connection> {
  return await mysql.createConnection({
    host: "localhost",
    database: "reversi",
    user: "reversi",
    password: "password",
  });
}
