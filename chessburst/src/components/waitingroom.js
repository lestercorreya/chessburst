import React, { useContext, useEffect } from "react";
import loadingGif from "../images/loadingGif.gif";
import { Context } from "../Context";
import { useHistory } from "react-router-dom";

function WaitingRoom() {
  const history = useHistory();
  const { value1, value4 } = useContext(Context);
  const [code] = value1;
  const [socket] = value4;

  useEffect(() => {
    if (!socket) return;
    socket.on("opponentJoined", (msg) => {
      history.push("/arena");
    });
    return () => socket.off("opponentJoined");
  }, [socket, history]); //gone

  return (
    <div
      className={`justify-center items-center absolute w-screen h-screen bg-background top-0 left-0 flex`}
    >
      <div className="w-11/12 max-w-md h-56 md:h-60 bg-white flex-col relative rounded-2xl shadow-2xl_blue">
        <div className="w-full h-20 bg-background rounded-xl flex justify-center items-center text-white text-lg md:text-xl">
          <img src={loadingGif} alt="" className="w-20 mr-5" />
          Waiting for an opponent
        </div>
        <div className="w-full h-40 flex justify-center items-center flex-col">
          <h1 className="mb-7 font-mono">Share this code with your friend</h1>
          <h1 className="text-3xl font-patrick">{code}</h1>
        </div>
      </div>
    </div>
  );
}

export default WaitingRoom;
