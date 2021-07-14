import express from "express";
import { User } from "../models/User.js";
import moment from "moment";

const matchRoute = express.Router();

matchRoute.post("/addMatch", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  user.matches.push({
    opponent: req.body.opponent,
    opponentPic: req.body.opponentPic,
    dateTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
    result: req.body.result,
  });
  user.save();
});

matchRoute.post("/getMatches", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  const matches = user.matches;
  const matchesWon = user.matches.filter((ele) => {
    return ele.result === "won";
  });
  res.send({ matches: matches, wins: matchesWon.length });
});

export { matchRoute };
