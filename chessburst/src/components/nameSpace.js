import React, { useContext } from "react";
import Timer from "./timer";
import { Context } from "../Context";

function NameSpace({ nameSpaceId, state, yourTurn }) {
  const { value2, value3 } = useContext(Context);
  const [opponentUser] = value3;
  const [loggedInUser] = value2;

  return (
    <div
      className={`w-screen h-24 absolute ${
        nameSpaceId === "top" ? "top-0 hidden sidebars:flex" : "bottom-0 flex"
      } justify-center items-center`}
    >
      <div className="max-w-560 w-11/12 h-16 bg-darkbackground flex justify-around items-center rounded-lg">
        <div className="flex justify-center items-center">
          <img
            src={
              nameSpaceId === "top"
                ? opponentUser.profilePic
                : loggedInUser.profilePic
            }
            alt=""
            className="w-10 h-10 rounded-full mr-2"
          />
          <p className="font-serif text-white">
            {nameSpaceId === "top"
              ? opponentUser.username
              : loggedInUser.username}
          </p>
        </div>
        <Timer state={state} yourTurn={yourTurn} />
      </div>
    </div>
  );
}

export default NameSpace;
