import express from "express";
// Middlewares
import { basicAuthHandler } from "./lib/basic.auth.handler";
const app = express();
const port = 3000;

app.use(express.json());

app.get("/status", (req, res) => {
  res.status(200).end();
});
app.head("/status", (req, res) => {
  res.status(200).end();
});

app.get(
  "/basic-auth",
  basicAuthHandler,
  (req: express.Request, res: express.Response) => {
    res.status(200).end();
  }
);

export const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
