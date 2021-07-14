import mongoose from "mongoose";

const MatchSchema = mongoose.Schema({
  opponent: String,
  opponentPic: String,
  dateTime: String,
  result: String,
});

const UserSchema = mongoose.Schema({
  email_id: String,
  username: String,
  profilePic: String,
  matches: [MatchSchema],
});

export const User = mongoose.model("Users", UserSchema);
