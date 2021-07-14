import React from "react";
import { normalMapping } from "../chessMappings";

function LeftPieceHolder({ leftOpen, capturedList }) {
  return (
    <div
      className={`bg-nativeDarkBlue w-36 h-screen rounded-r-2xl border-4 border-black items-center flex flex-col absolute left-0 z-10 transform ${
        leftOpen ? "translate-x-0" : "-translate-x-36"
      } transition-transform sidebars:static sidebars:h-560 sidebars:translate-x-0`}
    >
      <p className="font-serif text-white m-3">White Pieces</p>
      <div className="w-full flex flex-col items-center scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100 scrollbar-thin">
        {capturedList.map((piece, i) => {
          if (piece === piece.toUpperCase()) {
            return <img src={normalMapping[piece]} alt="" key={i} />;
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
}

export default LeftPieceHolder;
