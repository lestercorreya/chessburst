import React from "react";
import { normalMapping } from "../chessMappings";

function RightPieceHolder({ rightOpen, capturedList }) {
  return (
    <div
      className={`bg-nativeBlue w-36 h-screen rounded-l-2xl border-4 border-black items-center flex flex-col absolute right-0 z-10 transform ${
        rightOpen ? "translate-x-0" : "translate-x-36"
      } transition-transform sidebars:static sidebars:h-560 sidebars:translate-x-0`}
    >
      <p className="font-serif text-black m-3">Black Pieces</p>
      <div className="w-full flex flex-col items-center scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100 scrollbar-thin">
        {capturedList.map((piece, i) => {
          if (piece !== piece.toUpperCase()) {
            return <img src={normalMapping[piece]} alt="" key={i} />;
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
}

export default RightPieceHolder;
