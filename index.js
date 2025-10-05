import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnection from "./config/db.js";

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

// ───────────────────── Database ───────────────────── //
dbConnection();

// ───────────────────── Server ───────────────────── //
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server is running on ${port}`);
});
