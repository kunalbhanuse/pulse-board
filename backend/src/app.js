import express from "express";
import authRouter from "./module/auth/auth.route.js";
import pollRouter from "./module/poll/poll.route.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/poll", pollRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
