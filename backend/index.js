import express from "express";
import cors from "cors";
import morgan from "morgan";
import { Server } from "socket.io";
import http from "http";
import dns from "dns/promises";
import "dotenv/config";
import { getConnection } from "./db/connection.js";
import authRouter from "./routes/auth.router.js";
import userRouter from "./routes/user.router.js";
import chatRouter from "./routes/chat.router.js";
import messageRouter from "./routes/message.router.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT_NUMBER ?? 3000;
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8000"],
  }),
);
app.use(morgan("dev"));
app.use(
  express.json({
    limit: "50mb",
  }),
);

app.get("/", (_, res) => res.json({ status: "Server is up and running" }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/message", messageRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:8000"],
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Set();

io.on("connection", (socket) => {
  socket.on("join-room", (userId) => {
    socket.join(userId);
  });

  socket.on("user-login", (userId) => {
    socket.userId = userId;
    onlineUsers.add(userId);
    io.emit("online-users", [...onlineUsers]);
  });

  socket.on("disconnect", () => {
    if (!socket.userId) return;

    onlineUsers.delete(socket.userId);

    io.emit("online-users", [...onlineUsers]);
  });

  socket.on("send-message", (data) => {
    io.to(data.members[0]).to(data.members[1]).emit("receive-message", data);
  });

  socket.on("profile-change", (user) => io.emit("user-profile", user));

  socket.on("clear-unread-message", (data) => {
    io.to(data.members[0])
      .to(data.members[1])
      .emit("message-count-cleared", data);
  });

  socket.on("user-typing", (data) =>
    io.to(data.members[0]).to(data.members[1]).emit("started-typing", data),
  );
});

app.use((err, _, res, _1) => {
  console.error("UPLOAD ERROR:", err);

  res.status(500).json({
    success: false,
    error: err.message ?? "Something went wrong",
  });
});

server.listen(PORT, async () => {
  console.log("Server running on port", PORT);
  const connection = await getConnection();
  if (connection) console.log("Mongodb connected successfully");
  else console.log("Something went wrong");
});
