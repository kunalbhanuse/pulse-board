import "dotenv/config";
import http from "node:http";
import app from "./src/app.js";
import dotenv from "dotenv";
import { connectDb } from "./src/common/config/db.js";

async function main() {
  await connectDb();
  const server = http.createServer(app);

  server.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost:${process.env.PORT}`);
  });
}

main();
