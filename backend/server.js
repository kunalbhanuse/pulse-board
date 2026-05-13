import "dotenv/config";
import http from "node:http";
import app from "./src/app.js";
import { Server } from "socket.io";

import { connectDb } from "./src/common/config/db.js";

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

async function main() {
  await connectDb();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  server.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost:${process.env.PORT}`);
  });
}

main();
