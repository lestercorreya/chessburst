import express from "express";
import { User } from "../models/User.js";

const userRoute = express.Router();

userRoute.post("/adduser", async (req, res) => {
  const user = new User({
    email_id: req.body.email_id,
    username: req.body.username,
    profilePic: req.body.profilePic,
  });

  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.send({ message: err });
  }
});

userRoute.post("/getspecificuser", (req, res) => {
  User.find(
    {
      email_id: req.body.email_id,
    },
    (err, data) => {
      res.send(data);
    }
  );
});

export { userRoute };
