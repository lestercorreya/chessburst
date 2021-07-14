import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { Stage, Layer, Rect, Image } from "react-konva";
import { MappingFunction, normalMapping } from "../chessMappings";
import { containsInList } from "../generalFunctions";
import { useStrictMode } from "react-konva";
import { Context } from "../Context";
import checkImage from "../images/checkImg.png";
import { useHistory } from "react-router-dom";

function useWindowSize() {
  const [width, setWidht] = useState(0);
  useLayoutEffect(() => {
    function updateSize() {
      setWidht(window.innerWidth);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  if (width < 580) {
    return width;
  } else {
    return 560;
  }
}

function Chessboard({
  setLeftOpen,
  setRightOpen,
  yourColor,
  yourTurn,
  setYourTurn,
  chess,
  setCapturedList,
}) {
  useStrictMode(true);
  const history = useHistory();
  const { value4, value1, value5, value2, value3 } = useContext(Context);
  const [loggedInUser] = value2;
  const [opponentUser] = value3;
  const [timeUpVar, setTimeUpVar] = value5;
  const [socket] = value4;
  const [code] = value1;
  const width = useWindowSize();
  const mappings = MappingFunction();
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [promotionList, setPromotionList] = useState([]);
  const [promotionDialogBox, setPromotionDialogBox] = useState("hidden");
  const [promotionPieceMovement, setPromotionPieceMovement] = useState();
  const chessArray = chess.board();
  const [pieceArray, setPieceArray] = useState([]);
  const [checkImg, setCheckImg] = useState(false);
  const [startingMessage, setStartingMessage] = useState(true);
  const letterMapping = {
    0: "a",
    1: "b",
    2: "c",
    3: "d",
    4: "e",
    5: "f",
    6: "g",
    7: "h",
  };
  const reverseLetterMapping = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
  };

  const emittingPieceMovement = useCallback(
    (from, to, promotion) => {
      setYourTurn(false);
      socket.emit("emittingPieceMovement", {
        from: from,
        to: to,
        promotion: promotion,
        code: code,
      });
    },
    [code, setYourTurn, socket]
  );

  const settingCapturedList = useCallback(
    (moved_obj) => {
      if (moved_obj["flags"].indexOf("c") !== -1) {
        setCapturedList((prevList) => {
          return [
            ...prevList,
            moved_obj["color"] === "w"
              ? moved_obj["captured"]
              : moved_obj["captured"].toUpperCase(),
          ];
        });
      }
    },
    [setCapturedList]
  );

  const settingPieceArray = useCallback(() => {
    var main_list = chess.board();
    var list = [];
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        if (main_list[i][j] !== null) {
          var temp_obj = {};
          temp_obj["x"] = j;
          temp_obj["y"] = i;
          if (main_list[i][j].color === "b") {
            temp_obj["piece"] = main_list[i][j].type;
          } else {
            temp_obj["piece"] = main_list[i][j].type.toUpperCase();
          }
          list.push(temp_obj);
        }
      }
    }
    setPieceArray(list);
  }, [setPieceArray, chess]);

  const removeFromRoom = useCallback(() => {
    socket.emit("removeFromRoom", code);
  }, [socket, code]);

  const checkOrCheckmate = useCallback(
    (person) => {
      if (chess.in_check()) {
        setCheckImg(true);
        setTimeout(() => setCheckImg(false), 3000);
      }
      if (chess.in_checkmate()) {
        removeFromRoom();
        if (person === "opponent") {
          addMatchFunction(
            "lost",
            loggedInUser.username,
            opponentUser.username,
            opponentUser.profilePic
          );
          history.push("/lost");
        } else {
          addMatchFunction(
            "won",
            loggedInUser.username,
            opponentUser.username,
            opponentUser.profilePic
          );
          history.push("/won");
        }
      }
    },
    [chess, history, loggedInUser, opponentUser, removeFromRoom]
  );

  const opponentMovementReceived = useCallback(
    (msg) => {
      setYourTurn(true);
      var moved_obj;
      if (msg.promotion === null) {
        moved_obj = chess.move({ from: msg.from, to: msg.to });
        settingPieceArray();
      } else {
        moved_obj = chess.move({
          from: msg.from,
          to: msg.to,
          promotion: msg.promotion,
        });
      }
      settingCapturedList(moved_obj);
      checkOrCheckmate("opponent");
    },
    [
      setYourTurn,
      checkOrCheckmate,
      chess,
      settingCapturedList,
      settingPieceArray,
    ]
  );

  const timeUp = useCallback(() => {
    const moves = chess.moves({ verbose: true });
    var moved_obj = chess.move(moves[0]);
    setPossibleMoves([]);
    settingPieceArray();
    checkOrCheckmate("you");
    settingCapturedList(moved_obj);
    emittingPieceMovement(
      moved_obj.from,
      moved_obj.to,
      moved_obj.promotion ? moved_obj.promotion : null
    );
    setTimeUpVar(false);
  }, [
    checkOrCheckmate,
    chess,
    emittingPieceMovement,
    setTimeUpVar,
    settingCapturedList,
    settingPieceArray,
  ]);

  useEffect(() => {
    settingPieceArray();
    setTimeout(() => {
      setStartingMessage(false);
    }, 5000);
  }, [settingPieceArray]);

  useEffect(() => {
    socket.on("emittingPieceMovement", (msg) => {
      opponentMovementReceived(msg);
    });
    socket.on("opponentDisconnected", (msg) => {
      removeFromRoom();
      addMatchFunction(
        "lost",
        opponentUser.username,
        loggedInUser.username,
        loggedInUser.profilePic
      );
      addMatchFunction(
        "won",
        loggedInUser.username,
        opponentUser.username,
        opponentUser.profilePic
      );
      history.push("/won");
    });
    return () => {
      socket.off("emittingPieceMovement");
      socket.off("opponentDisconnected");
    };
  }, [
    opponentUser,
    loggedInUser,
    socket,
    removeFromRoom,
    opponentMovementReceived,
    history,
  ]); //[opponentUser,code]

  useEffect(() => {
    if (!timeUpVar) return;
    timeUp();
  }, [timeUpVar, timeUp]);

  function addMatchFunction(
    result,
    yourUsername,
    opponentUsername,
    opponentPic
  ) {
    fetch("http://localhost:5000/match/addMatch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: yourUsername,
        opponent: opponentUsername,
        opponentPic: opponentPic,
        result: result,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {})
      .catch((err) => console.log(err));
  }

  function setPossibleMovesFunction(e) {
    var x = Math.floor((e.target.attrs.x + width / 16) / (width / 8));
    var y = Math.floor((e.target.attrs.y + width / 16) / (width / 8));
    var code;
    if (yourColor === "white") {
      code = indexToCodeConverter([x, y]);
    } else {
      code = indexToCodeConverter([x, 7 - y]);
    }
    var list = chess.moves({ square: code, verbose: true });
    for (var i = 0; i < list.length; i++) {
      list[i] = codeToIndexConverter(list[i].to);
    }
    setPossibleMoves(list);
  }

  function codeToIndexConverter(chessCode) {
    var list = chessCode.split("");
    var x = reverseLetterMapping[list[list.length - 2]];
    var y = 8 - list[list.length - 1];
    return [x, y];
  }

  function indexToCodeConverter([x, y]) {
    var prefix = letterMapping[x];
    var postfix = 8 - y;
    return prefix + postfix;
  }

  function dragStart(e) {
    e.target.moveToTop();
    setPossibleMovesFunction(e);
  }

  function setPromotionListFunction(piece) {
    var list;
    if (piece.piece === piece.piece.toUpperCase()) {
      list = ["N", "Q", "R", "B"];
    } else {
      list = ["n", "q", "r", "b"];
    }
    setPromotionList(list);
  }

  function dragEnd(e, piece) {
    var x = Math.floor((e.target.attrs.x + width / 16) / (width / 8));
    var y = Math.floor((e.target.attrs.y + width / 16) / (width / 8));
    var real_y;
    if (yourColor === "white") {
      real_y = y;
    } else {
      real_y = 7 - y;
    }
    if (containsInList(possibleMoves, [x, real_y])) {
      //changed
      var from = indexToCodeConverter([piece.x, piece.y]);
      var to = indexToCodeConverter([x, real_y]); //changed
      var moved_obj = chess.move({ from: from, to: to });
      if (moved_obj === null) {
        setPromotionPieceMovement({ from: from, to: to });
        setPromotionDialogBox("flex");
        setPromotionListFunction(piece);
      } else {
        checkOrCheckmate("you");
        emittingPieceMovement(from, to, null);
        settingCapturedList(moved_obj);
      }
      settingPieceArray();
    } else {
      e.target.setX(piece.x * (width / 8));
      e.target.setY(piece.y * (width / 8));
    }
    setPossibleMoves([]);
  }

  function promotionPieceSelected(piece) {
    var moved_obj = chess.move({
      from: promotionPieceMovement.from,
      to: promotionPieceMovement.to,
      promotion: piece.toLowerCase(),
    });
    emittingPieceMovement(
      promotionPieceMovement.from,
      promotionPieceMovement.to,
      piece.toLowerCase()
    );
    checkOrCheckmate("you");
    settingCapturedList(moved_obj);
    settingPieceArray();
  }

  return (
    <>
      <div className="chessboard">
        <Stage
          width={width}
          height={width}
          onMouseDown={() => {
            setLeftOpen(false);
            setRightOpen(false);
          }}
          onTap={() => {
            setLeftOpen(false);
            setRightOpen(false);
          }}
        >
          <Layer>
            {chessArray.map((row, i) => {
              return row.map((cell, j) => {
                return (
                  <Rect
                    key={i + j}
                    x={(i * width) / 8}
                    y={(j * width) / 8}
                    width={width / 8}
                    height={width / 8}
                    fill={(i + j) % 2 === 0 ? "#70C2FF" : "#255E8B"}
                  />
                );
              });
            })}
            {possibleMoves.map((move, i) => {
              return (
                <Rect
                  key={i}
                  x={move[0] * (width / 8)}
                  y={
                    yourColor === "white"
                      ? move[1] * (width / 8)
                      : (7 - move[1]) * (width / 8)
                  } //changed
                  width={width / 8}
                  height={width / 8}
                  fill="#38A17F"
                  stroke="black"
                  strokeWidth={2}
                />
              );
            })}
            {pieceArray.map((piece, i) => {
              return (
                <Image
                  key={i}
                  x={(piece.x * width) / 8}
                  y={
                    yourColor === "white"
                      ? (piece.y * width) / 8
                      : ((7 - piece.y) * width) / 8
                  }
                  image={mappings[piece.piece]}
                  draggable={yourTurn}
                  height={width / 8}
                  width={width / 8}
                  onDragStart={(e) => dragStart(e)}
                  onDragEnd={(e) => dragEnd(e, piece)}
                  _useStrictMode
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
      <div
        className={`w-screen h-screen flex justify-center items-center absolute top-0 left-0 ${
          checkImg ? "static" : "hidden"
        }`}
      >
        <img src={checkImage} alt="" />
      </div>
      <div
        className={`w-screen h-screen flex justify-center items-center absolute top-0 left-0 ${
          startingMessage ? "flex" : "hidden"
        }`}
      >
        <div className="w-11/12 md:w-96 h-40 rounded-lg bg-background flex justify-center items-center p-2">
          <center className="font-mono font-bold text-white">
            Closing or refresing the browser would end in forfeit
          </center>
        </div>
      </div>
      <div
        className={`w-screen h-screen bg-black absolute top-0 left-0 z-20 bg-opacity-50 ${promotionDialogBox} justify-center items-center`}
      >
        <div className="flex justify-center flex-col items-center bg-blue-400 p-5 rounded-lg shadow-promotion">
          <p className="font-mono font-bold text-xl mb-6">
            Choose a piece to promote your pawn to
          </p>
          <div className="flex justify-around items-center">
            {promotionList.map((piece, i) => {
              return (
                <img
                  key={i}
                  src={normalMapping[piece]}
                  alt=""
                  onClick={() => {
                    setPromotionDialogBox("hidden");
                    promotionPieceSelected(piece);
                  }}
                  className="cursor-pointer"
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Chessboard;
