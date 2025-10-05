import express from "express";
import dotenv from "dotenv";
import cors from "cors";
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

dotenv.config();

const app = express();
const port = process.env.PORT;

// ───────────────────── Middlewares ───────────────────── //
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// ───────────────────── Database ───────────────────── //
dbConnection();

// ───────────────────── Server ───────────────────── //
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server is running on ${port}`);
});
