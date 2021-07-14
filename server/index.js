import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

const app = express();
const server = http.createServer(app);
dotenv.config();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

// importing routes

import { userRoute } from "./routes/userRoute.js";
import { matchRoute } from "./routes/matchRoute.js";

app.use("/user", userRoute);
app.use("/match", matchRoute);

// everything related to database connection and app listening
const PORT = process.env.PORT || 5000;
// const CONNECTION_URL =
//   "mongodb+srv://lestercorreya:linusunno@listenalcluster.1ujhq.mongodb.net/chessburstdatabase?retryWrites=true&w=majority";

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => server.listen(PORT, () => console.log("server running on port")))
  .catch((err) => console.log(err.message));

mongoose.set("useFindAndModify", false);

// end of database connection and app listening

// Socket.io

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("createGameJoin", (msg) => {
    socket.join(String(msg));
  });
  socket.on("sendingAndReceivingCredentials", async (msg) => {
    socket.to(msg.code.toString()).emit("sendingAndReceivingCredentials", {
      username: msg.username,
      profilePic: msg.profilePic,
    });
  });
  socket.on("joinGameJoin", async (msg) => {
    try {
      const clients = io.sockets.adapter.rooms.get(msg.code);
      if (clients.size == 1 && !clients.has(socket.id)) {
        socket.join(msg.code);
        socket.to(msg.code).emit("opponentJoined", "");
        socket.emit("joinGamePermission", {
          status: "success",
          code: msg.code,
        });
      } else {
        socket.emit("joinGamePermission", {
          status: "failure",
          code: msg.code,
        });
      }
    } catch {
      socket.emit("joinGamePermission", "failure");
    }
  });
  socket.on("emittingPieceMovement", (msg) => {
    socket.to(msg.code.toString()).emit("emittingPieceMovement", {
      from: msg.from,
      to: msg.to,
      promotion: msg.promotion,
    });
  });
  socket.on("removeFromRoom", (msg) => {
    socket.leave(msg.toString());
  });
  socket.on("disconnect", (msg) => {
    socket.broadcast.emit("opponentDisconnected", "");
  });
});

// end of Socket.io
