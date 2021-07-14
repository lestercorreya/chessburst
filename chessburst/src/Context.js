import React, { useState, createContext, useEffect } from "react";
import io from "socket.io-client";
import user from "./images/user.png";

export const Context = createContext();

export const ContextProvider = (props) => {
  const [code, setCode] = useState();
  const [loggedInUser, setLoggedInUser] = useState();
  const [opponentUser, setOpponentUser] = useState({
    username: "Opponent",
    profilePic: user,
  });
  const [socket, setSocket] = useState();
  const [timeUpVar, setTimeUpVar] = useState(false);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <Context.Provider
      value={{
        value1: [code, setCode],
        value2: [loggedInUser, setLoggedInUser],
        value3: [opponentUser, setOpponentUser],
        value4: [socket, setSocket],
        value5: [timeUpVar, setTimeUpVar],
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
