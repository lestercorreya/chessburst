import React, { useEffect, useState, useContext, useCallback } from "react";
import Chessboard from "./chessboard.js";
import LeftPieceHolder from "./leftpieceholder";
import RightPieceHolder from "./rightpieceholder";
import SidebarBurgers from "./sidebarburgers";
import NameSpace from "./nameSpace.js";
import { Context } from "../Context";
import * as Chess from "chess.js";
import { Redirect } from "react-router";

function Arena() {
  const { value1, value2, value3, value4 } = useContext(Context);
  const [code] = value1;
  const [chess] = useState(new Chess());
  const [loggedInUser] = value2;
  const [opponentUser, setOpponentUser] = value3;
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [capturedList, setCapturedList] = useState([]);
  const [socket] = value4;
  const [yourColor, setYourColor] = useState("");
  const [yourTurn, setYourTurn] = useState(false);

  useEffect(() => {
    if (!socket) return;
    socket.emit("sendingAndReceivingCredentials", {
      code: code,
      username: loggedInUser.username,
      profilePic: loggedInUser.profilePic,
    });
    socket.on("sendingAndReceivingCredentials", (msg) => {
      setOpponentUser({ username: msg.username, profilePic: msg.profilePic });
    });
    return () => socket.off("sendingAndReceivingCredentials");
  }, [socket, code, loggedInUser, setOpponentUser]);

  const settingTimer = useCallback(() => {
    if (loggedInUser.username.localeCompare(opponentUser.username) === 1) {
      setYourColor("white");
      setYourTurn(true);
    } else {
      setYourColor("black");
      setYourTurn(false);
    }
  }, [loggedInUser, opponentUser, setYourColor, setYourTurn]);

  useEffect(() => {
    if (!loggedInUser) {
      return;
    }
    settingTimer();
  }, [opponentUser, loggedInUser, settingTimer]); //doubt

  if (!loggedInUser) {
    return <Redirect to="/" />;
  } else {
    return (
      <div className="w-screen h-screen bg-background flex justify-center items-center sidebars:justify-between overflow-hidden relative">
        <NameSpace nameSpaceId="top" state={!yourTurn} yourTurn={yourTurn} />
        <NameSpace nameSpaceId="bottom" state={yourTurn} yourTurn={yourTurn} />
        <SidebarBurgers
          setLeftOpen={setLeftOpen}
          setRightOpen={setRightOpen}
          leftOpen={leftOpen}
          rightOpen={rightOpen}
          state={!yourTurn}
          yourTurn={yourTurn}
        />
        <LeftPieceHolder leftOpen={leftOpen} capturedList={capturedList} />
        <Chessboard
          setLeftOpen={setLeftOpen}
          setRightOpen={setRightOpen}
          yourColor={yourColor}
          yourTurn={yourTurn}
          setYourTurn={setYourTurn}
          chess={chess}
          setCapturedList={setCapturedList}
        />
        <RightPieceHolder rightOpen={rightOpen} capturedList={capturedList} />
      </div>
    );
  }
}

export default Arena;
