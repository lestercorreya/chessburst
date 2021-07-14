import React, { useEffect, useState, useContext } from "react";
import { Context } from "../Context";

function Timer({ state, yourTurn }) {
  const [time, setTime] = useState([2, 0, 0]);
  const { value5 } = useContext(Context);
  const [, setTimeUpVar] = value5;

  function changingTime(prevTime) {
    var list = prevTime.slice();
    if (list[2] === 0) {
      if (list[1] === 0) {
        if (list[0] === 0) {
        } else {
          list[0] -= 1;
          list[1] = 5;
          list[2] = 9;
        }
      } else {
        list[1] -= 1;
        list[2] = 9;
      }
    } else {
      list[2] -= 1;
    }
    return list;
  }

  useEffect(() => {
    var timeUpInterval;
    var timeInterval;
    if (state) {
      timeInterval = setInterval(() => {
        setTime((prevTime) => changingTime(prevTime));
      }, 1000);
      timeUpInterval = setInterval(() => {
        if (yourTurn) {
          setTimeUpVar(true);
        }
      }, 120000);
    } else {
      clearInterval(timeUpInterval);
      clearInterval(timeInterval);
      setTime([2, 0, 0]);
    }
    return () => {
      clearInterval(timeUpInterval);
      clearInterval(timeInterval);
    };
  }, [state, setTimeUpVar, yourTurn]); //gone

  return (
    <div className="flex justify-center items-center w-20 h-8 rounded-md bg-red-500 border-black  border-2 font-mono text-xl">
      <p>{`${time[0]}:${time[1]}${time[2]}`}</p>
    </div>
  );
}

export default Timer;
