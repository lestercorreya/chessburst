import React from "react";
import construction from "../images/construction.gif";

function About() {
  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center flex-col">
      <img src={construction} alt="" className="w-56" />
      <div>
        <p className="text-gray-300 text-2xl font-mono flex justify-center items-center font-semibold">
          Page
        </p>
        <p className="text-gray-300 text-2xl font-mono ml-5 font-semibold">
          Under Construction!
        </p>
      </div>
    </div>
  );
}

export default About;
