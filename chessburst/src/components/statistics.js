import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Context } from "../Context";
import loadingGif from "../images/loadingGif.gif";

function Statistics() {
  const { value2 } = useContext(Context);
  const [matches, setMatches] = useState([]);
  const [wins, setWins] = useState("-");
  const [loading, setLoading] = useState(true);
  const [loggedInUser] = value2;

  useEffect(() => {
    if (!loggedInUser) return;
    fetch("http://localhost:5000/match/getMatches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: loggedInUser.username,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setMatches(data.matches);
        setWins(data.wins);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [loggedInUser]);

  if (!loggedInUser) {
    return <Redirect to="/" />;
  }

  if (loading) {
    return (
      <div className="w-screen h-screen bg-background flex justify-center items-center flex-col">
        <p className="text-3xl text-white font-mono">Loading ...</p>
        <img src={loadingGif} alt="" />
      </div>
    );
  } else {
    return (
      <div className="max-w-full min-h-screen bg-background flex flex-col justify-around items-center">
        <div className="m-5 w-11/12 h-20 statistics_md:w-auto statistics_md:h-auto statistics_md:p-5 bg-darkbackground rounded-lg text-white flex justify-center items-center shadow-2xl_blue">
          <img
            src={loggedInUser.profilePic}
            alt=""
            className="w-10 h-10 rounded-full mr-2"
          />
          <p className="text-white ml-3">{loggedInUser.username}</p>
        </div>
        <div className="flex justify-center items-center flex-col statistics_md:flex-row">
          <div className="w-64 h-44 bg-darkbackground m-5 shadow-2xl_blue flex flex-col justify-center items-center rounded-xl">
            <p className="text-nativeBlue text-xl mb-4">Matches Played</p>
            <p className="text-white text-3xl font-mono">{matches.length}</p>
          </div>
          <div className="w-64 h-44 bg-darkbackground m-5 shadow-2xl_blue flex flex-col justify-center items-center rounded-xl">
            <p className="text-nativeBlue text-xl mb-4">Matches Won</p>
            <p className="text-white text-3xl font-mono">{wins}</p>
          </div>
          <div className="w-64 h-44 bg-darkbackground m-5 shadow-2xl_blue flex flex-col justify-center items-center rounded-xl">
            <p className="text-nativeBlue text-xl mb-4">Win ratio</p>
            <p className="text-white text-3xl font-mono">
              {Math.round((wins / matches.length) * 10000) / 100}%
            </p>
          </div>
        </div>
        <div className="w-full statistics_md:w-850 p-3">
          <div className="w-full h-12 bg-white rounded-lg flex justify-around items-center">
            <p className="text-xs font-semibold font-mono flex-1 flex justify-center items-center">
              Opponent
            </p>
            <p className="text-xs font-semibold font-mono flex-1 flex justify-center items-center">
              Time,Date
            </p>
            <p className="text-xs font-semibold font-mono flex-1 flex justify-center items-center">
              Result
            </p>
          </div>
          {matches.map((match, i) => {
            return (
              <div
                className={`w-full h-16 ${
                  match.result === "won" ? "bg-green-200" : "bg-red-200"
                } rounded-lg mt-2 flex justify-around items-center`}
                key={i}
              >
                <div className="flex justify-center items-center flex-1">
                  <img
                    src={match.opponentPic}
                    alt=""
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <p className="text-xs font-semibold ml-2">{match.opponent}</p>
                </div>
                <p className="text-xs font-semibold flex-1 flex justify-center items-center">
                  {match.dateTime}
                </p>
                <p className="text-xs font-semibold flex-1 flex justify-center items-center">
                  {match.result}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Statistics;
