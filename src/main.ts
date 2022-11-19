import express from "express";
import morgan from "morgan";

const PORT = 3000;

const app = express();

app.use(morgan("dev"));

app.get("/api/hello", async (req, res) => {
  res.json({
    message: "hello Express!!!",
  });
});

app.listen(PORT, () => {
  console.log(`server started: http://localhost:${PORT}`);
});
