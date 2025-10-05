import express from "express";

const searchRouter = express.Router();

searchRouter.get("/check", (req, res) => {
  res.send("search route");
});

export default searchRouter;
