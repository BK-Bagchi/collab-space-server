import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import expressMongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import dbConnection from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import chatRouter from "./routes/chat.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import fileRouter from "./routes/file.route.js";
import notificationRouter from "./routes/notification.route.js";
import projectRouter from "./routes/project.route.js";
import searchRouter from "./routes/search.route.js";
import taskRouter from "./routes/task.route.js";
import userRouter from "./routes/user.route.js";
import errorHandler from "./middleware/errorHandler.js";
import chatSocket from "./socket/chat.socket.js";
import activeSocket from "./socket/active.socket.js";
import projectChatSocket from "./socket/projectChat.socket.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

// ───────────────────── Middlewares ───────────────────── //
app.use(helmet());
app.use((req, res, next) => {
  if (req.body) expressMongoSanitize.sanitize(req.body);
  if (req.params) expressMongoSanitize.sanitize(req.params);

  next();
});
app.use(compression());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
); //handles which origins can make requests
app.use(morgan("dev")); //console logs http requests. Formats: [dev, combined, common, tiny, short]
app.use(express.json()); // receives json data
app.use(express.urlencoded({ extended: false })); //accepts client submitted form data

// ───────────────────── Socket.io ───────────────────── //
const server = http.createServer(app); // Create HTTP server and attach socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  },
});

// Central connection handler
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  activeSocket(io, socket);
  chatSocket(io, socket);
  projectChatSocket(io, socket);

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
    // for (const userId in users) {
    //   users[userId] = users[userId].filter((id) => id !== socket.id);
    //   if (users[userId].length === 0) delete users[userId];
    // }
  });
});

// ───────────────────── Routes ───────────────────── //
app.get("/", (req, res) => {
  res.send(`🚀Collab Space project is running`);
});

app.use("/rest/auth", authRouter);
app.use("/rest/chat", chatRouter);
app.use("/rest/dashboard", dashboardRouter);
app.use("/rest/file", fileRouter);
app.use("/rest/notification", notificationRouter);
app.use("/rest/project", projectRouter);
app.use("/rest/search", searchRouter);
app.use("/rest/task", taskRouter);
app.use("/rest/user", userRouter);
app.use(errorHandler);

// ───────────────────── Database ───────────────────── //
dbConnection();

// ───────────────────── Server ───────────────────── //
server.listen(process.env.PORT, () => {
  console.log(`🚀 Server is running on ${port}`);
});
