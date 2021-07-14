import React, { useContext } from "react";
import { Link } from "react-router-dom";
import lost from "../images/lost.png";
import { Context } from "../Context";

function LostPage() {
  const { value3 } = useContext(Context);
  const [opponentUser] = value3;

  return (
    <div className="w-screen h-screen bg-background flex justify-center items-center">
      <div className="w-72 h-72 md:w-96 md:h-96 bg-white rounded-2xl flex justify-around items-center flex-col">
        <div className="flex justify-center items-center flex-col">
          <img src={lost} alt="" className="" />
          <p className="text-red-500 text-3xl md:text-5xl font-extrabold mt-6">
            You Lost
          </p>
          <p className="text-xl md:text-3xl font-extrabold">
            better luck next time!
          </p>
        </div>
        <Link
          className="bg-indigo-600 w-32 h-10 md:w-40 md:h-14 rounded-lg text-white flex justify-center items-center font-bold hover:bg-indigo-700 cursor-pointer text-sm md:text-base"
          to="/"
        >
          Go back home
        </Link>
        <div className="w-11/12 h-14 md:h-16 bg-gray-200 rounded-xl flex justify-around items-center">
          <span className="px-4 py-2 md:text-base text-xs rounded-full text-red-600  bg-red-200 ">
            Opponent
          </span>
          <div className="flex justify-center items-center">
            <div className="md:w-11 md:h-11 w-9 h-9 bg-red-400 rounded-full"></div>
            <p className="font-semibold ml-3 md:text-base text-sm">
              {opponentUser.username}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LostPage;
