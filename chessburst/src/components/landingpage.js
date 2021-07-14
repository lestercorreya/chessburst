import React, { createRef, useContext, useEffect, useState } from "react";
import chessboard from "../images/chessboard.png";
import chesskids from "../images/chesskids.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import user from "../images/user.png";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faChessKing, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import google from "../images/google.png";
import GoogleLogin from "react-google-login";
import { useHistory, Link } from "react-router-dom";
import { Context } from "../Context";

function Landingpage() {
  const history = useHistory();
  const { value1, value2, value4 } = useContext(Context);
  const [, setCode] = value1;
  const [loggedInUser, setLoggedInUser] = value2;
  const [usernameDialogBox, setUsernameDialogBox] = useState("hidden");
  const [newUserEmailId, setNewUserEmailId] = useState();
  const [newUserProfilePic, setNewUserProfilePic] = useState();
  const googleSignInRef = createRef();
  const [joinGameDialogBox, setJoinGameDialogBox] = useState("hidden");
  const [socket] = value4;
  const [joinGameError, setJoinGameError] = useState(false);

  useEffect(() => {
    if (!socket) return;
    socket.on("joinGamePermission", (msg) => {
      if (msg.status === "success") {
        setCode(parseInt(msg.code));
        history.push("/arena");
      } else {
        setJoinGameError(true);
      }
    });
    return () => socket.off("joinGamePermission");
  }, [socket, setCode, history]); //gone

  function responseGoogle(response) {
    fetch("http://localhost:5000/user/getspecificuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_id: response.profileObj.email,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.length === 1) {
          setLoggedInUser(data[0]);
        } else {
          setUsernameDialogBox("flex");
          setNewUserEmailId(response.profileObj.email);
          setNewUserProfilePic(response.profileObj.imageUrl);
        }
      })
      .catch((err) => console.log(err));
  }

  function usernameSubmitted(e) {
    fetch("http://localhost:5000/user/adduser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_id: newUserEmailId,
        username: e.target.previousElementSibling.value,
        profilePic: newUserProfilePic,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLoggedInUser(data);
        setUsernameDialogBox("hidden");
      })
      .catch((err) => console.log(err));
  }

  function createGameClicked() {
    if (!loggedInUser) {
      googleSignInRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      const code = Math.floor(10000 + Math.random() * 90000);
      setCode(code);
      socket.emit("createGameJoin", code);
      history.push("/waitingroom");
    }
  }

  function joinGameClicked() {
    if (!loggedInUser) {
      googleSignInRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      setJoinGameDialogBox("flex");
    }
  }

  function leaderBoardClicked() {
    if (!loggedInUser) {
      googleSignInRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      history.push("/statistics");
    }
  }

  function joinGameDialogBoxClose() {
    setJoinGameDialogBox("hidden");
    setJoinGameError(false);
  }

  function joinGamePermissionCheck(code) {
    socket.emit("joinGameJoin", {
      code: code,
      username: loggedInUser.username,
      profilePic: loggedInUser.profilePic,
    });
  }

  return (
    <div className="bg-background w-screen h-screen overflow-auto overflow-x-hidden">
      <nav className="w-full h-16 fixed bg-background flex justify-center items-center md:justify-between">
        <div className="flex items-center ml-5 flex-1 justify-center md:justify-start">
          <FontAwesomeIcon
            icon={faChessKing}
            className="text-2xl text-nativeBlue"
          />
          <p className="text-2xl ml-3 text-nativeBlue font-sail">Chess Burst</p>
        </div>
        <div className="items-center justify-center mr-5 hidden md:flex flex-1">
          <img
            src={loggedInUser ? loggedInUser.profilePic : user}
            alt=""
            className="w-9 h-9 rounded-full"
          />
          <p className="text-gray-400 ml-3">
            {loggedInUser ? loggedInUser.username : "Please sign in"}
          </p>
        </div>
        <div className="flex-1 hidden md:block"></div>
      </nav>
      <div
        className={`justify-center items-center absolute w-screen h-screen bg-black top-0 left-0 bg-opacity-30 ${usernameDialogBox}`}
      >
        <div className="w-screen max-w-md h-60 bg-white flex-col relative rounded-2xl shadow-2xl_blue">
          <div className="w-full h-20 bg-background rounded-xl flex justify-center items-center text-white text-xl">
            Enter a username
          </div>
          <div className="w-full h-40 flex justify-center items-center flex-col">
            <input
              type="text"
              className="bg-gray-300 h-9 w-56 mb-7 placeholder-gray-600 p-2 shadow-md"
              placeholder="eg:-rocky123"
            />
            <div
              className="w-40 h-9 bg-nativeBlue flex justify-center items-center rounded-2xl shadow-md font-medium hover:bg-blue-400 cursor-pointer"
              onClick={(e) => {
                usernameSubmitted(e);
              }}
            >
              Submit
            </div>
          </div>
        </div>
      </div>
      <div
        className={`justify-center items-center absolute w-screen h-screen bg-black top-0 left-0 bg-opacity-30 ${joinGameDialogBox}`}
      >
        <div className="w-11/12 max-w-md h-56 md:h-60 bg-white flex-col relative rounded-2xl shadow-2xl_blue">
          <div className="w-full h-20 bg-background rounded-xl flex justify-center items-center text-white text-xl relative">
            Enter the code
            <FontAwesomeIcon
              icon={faTimesCircle}
              className="text-2xl text-nativeBlue absolute right-2 top-2 cursor-pointer"
              onClick={joinGameDialogBoxClose}
            />
          </div>
          <div className="w-full h-40 flex justify-center items-center flex-col">
            <input
              type="text"
              className="bg-gray-300 h-9 w-56 mb-7 placeholder-gray-600 p-2 shadow-md"
              placeholder="eg:-12345"
            />
            <div
              className="w-40 h-9 bg-nativeBlue flex justify-center items-center rounded-2xl shadow-md font-medium hover:bg-blue-400 cursor-pointer"
              onClick={(e) => {
                joinGamePermissionCheck(e.target.previousElementSibling.value);
                e.target.previousElementSibling.value = "";
              }}
            >
              Join
            </div>
            <p
              className={`text-red-500 ${
                joinGameError ? "inline-block" : "hidden"
              }`}
            >
              Code Invalid
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-bottom w-full mt-16 md:flex-row">
        <div className="flex bg-darkbackground flex-col items-center justify-around flex-1 md:justify-center">
          <div className="w-52 h-36 flex justify-center items-center md:w-8/12 md:mb-5 lg:mb-11">
            <p className="font-serif text-3xl text-white md:text-4xl text-center lg:text-5xl">
              Play chess with your friends for free.
            </p>
          </div>
          <div className="">
            <div
              className="bg-nativeBlue h-12 w-32 flex justify-center items-center rounded-xl hover:bg-blue-400 cursor-pointer lg:h-16 lg:w-56 shadow-2xl"
              onClick={createGameClicked}
            >
              <p className="font-sans font-semibold lg:text-xl">Create Game</p>
            </div>
            <div
              className="bg-gray-300 hover:bg-gray-400 h-12 w-32 flex justify-center items-center mt-4 rounded-xl cursor-pointer lg:h-16 lg:w-56 shadow-2xl"
              onClick={joinGameClicked}
            >
              <p className="font-sans font-semibold lg:text-xl">Join Game</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <img
            src={chessboard}
            alt=""
            className="w-64 h-64 md:w-96 md:h-96 lg:w-500 lg:h-500"
          />
        </div>
      </div>
      <div className="bg-background w-screen h-70 sm:h-screen">
        <div className="h-70bottom w-full sm:h-bottom">
          <div className="bg-darkbackground h-1/2 lg:h-3/4 w-full flex justify-center items-center p-4">
            <img
              src={chesskids}
              alt=""
              className="w-1/2 flex-1 mr-4 max-h-full"
            />
            <div className="flex justify-center items-center flex-col flex-1 h-full">
              <div className="flex justify-center items-center flex-col mb-7">
                <p className="font-patrick text-gray-400 md:text-4xl">
                  When you see a good move, look for a better one
                </p>
                <p className="font-patrick text-gray-400 md:text-2xl">
                  - Emmanual Lasker
                </p>
              </div>
              <GoogleLogin
                clientId="375271093414-45duj5fv8q2bbj5emkbvp04ju4cq09th.apps.googleusercontent.com"
                render={(renderProps) => (
                  <div
                    className="bg-nativeBlue rounded-2xl flex justify-between items-center h-8 p-1 md:p-5 lg:p-8 cursor-pointer hover:bg-blue-400 shadow-2xl"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    ref={googleSignInRef}
                  >
                    <img src={google} alt="" className="mr-2 h-7 sm:h-auto" />
                    <p className="text-xs lg:text-2xl">
                      {loggedInUser ? "Switch account" : "Sign in with google"}
                    </p>
                  </div>
                )}
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                isSignedIn={true}
                cookiePolicy={"single_host_origin"}
              />
            </div>
          </div>
          <div className="w-scree h-1/2 lg:h-1/4 flex justify-center items-center flex-col">
            <div
              className="h-11 w-36 bg-nativeBlue flex justify-center items-center rounded-2xl m-5 shadow-2xl font-semibold cursor-pointer hover:bg-blue-400"
              onClick={leaderBoardClicked}
            >
              Statistics
            </div>
            <Link
              className="h-11 w-36 bg-nativeBlue text-center flex justify-center items-center rounded-2xl m-5 shadow-2xl font-semibold cursor-pointer hover:bg-blue-400"
              to="/about"
            >
              About
            </Link>
          </div>
        </div>
        <footer className="w-full h-16 bg-darkbackground flex relative justify-center items-center text-sm md:text-xl">
          <div className="flex justify-center items-center ml-5 absolute left-0">
            <FontAwesomeIcon icon={faChessKing} className="text-gray-400" />
            <p className="ml-3 text-gray-400 font-sail">Chess Burst</p>
          </div>
          <div className="">
            <FontAwesomeIcon
              icon={faTwitter}
              className="text-gray-400 m-2 md:m-5 cursor-pointer hover:text-nativeBlue"
            />
            <FontAwesomeIcon
              icon={faFacebook}
              className="text-gray-400 m-2 md:m-5 cursor-pointer hover:text-nativeBlue"
            />
            <FontAwesomeIcon
              icon={faInstagram}
              className="text-gray-400 m-2 md:m-5 cursor-pointer hover:text-nativeBlue"
            />
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Landingpage;
