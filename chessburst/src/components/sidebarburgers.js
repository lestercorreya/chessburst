import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Timer from "./timer";
import { Context } from "../Context";

function SidebarBurgers({
  setLeftOpen,
  setRightOpen,
  leftOpen,
  rightOpen,
  state,
  yourTurn,
}) {
  const { value3 } = useContext(Context);
  const [opponentUser] = value3;

  return (
    <div className="w-11/12 rounded-lg max-w-560 absolute top-5 flex justify-between items-center p-3 bg-darkbackground sidebars:hidden">
      <div
        className="bg-nativeDarkBlue w-10 h-10 rounded-md border-black border-2 flex items-center justify-center cursor-pointer"
        onClick={() => setLeftOpen(!leftOpen)}
      >
        <FontAwesomeIcon icon={faChevronDown} className="text-xl" />
      </div>
      <div className="flex justify-center items-center">
        <div className="flex justify-center items-center">
          <img
            src={opponentUser.profilePic}
            alt=""
            className="w-10 h-10 rounded-full mr-2"
          />
          <p className="font-serif text-white mr-2">{opponentUser.username}</p>
        </div>
        <Timer state={state} yourTurn={yourTurn} />
      </div>
      <div
        className="bg-nativeBlue w-10 h-10 rounded-md border-black border-2 flex items-center justify-center cursor-pointer"
        onClick={() => setRightOpen(!rightOpen)}
      >
        <FontAwesomeIcon icon={faChevronDown} className="text-xl" />
      </div>
    </div>
  );
}

export default SidebarBurgers;
