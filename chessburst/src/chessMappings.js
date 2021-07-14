import {
  blackPawn,
  whitePawn,
  blackRook,
  whiteRook,
  blackHorse,
  whiteHorse,
  blackBishop,
  whiteBishop,
  blackQueen,
  whiteQueen,
  blackKing,
  whiteKing,
} from "./imageImport.js";
import useImage from "use-image";

function MappingFunction() {
  // const mapping = {
  //   r: { b: useImage(blackRook)[0], w: useImage(whiteRook)[0] },
  //   n: { b: useImage(blackHorse)[0], w: useImage(whiteHorse)[0] },
  //   b: { b: useImage(blackBishop)[0], w: useImage(whiteBishop)[0] },
  //   q: { b: useImage(blackQueen)[0], w: useImage(whiteQueen)[0] },
  //   k: { b: useImage(blackKing)[0], w: useImage(whiteKing)[0] },
  //   p: { b: useImage(blackPawn)[0], w: useImage(whitePawn)[0] },
  // };

  const mapping = {
    r: useImage(blackRook)[0],
    R: useImage(whiteRook)[0],
    n: useImage(blackHorse)[0],
    N: useImage(whiteHorse)[0],
    b: useImage(blackBishop)[0],
    B: useImage(whiteBishop)[0],
    q: useImage(blackQueen)[0],
    Q: useImage(whiteQueen)[0],
    k: useImage(blackKing)[0],
    K: useImage(whiteKing)[0],
    p: useImage(blackPawn)[0],
    P: useImage(whitePawn)[0],
  };

  return mapping;
}

const normalMapping = {
  r: blackRook,
  R: whiteRook,
  n: blackHorse,
  N: whiteHorse,
  b: blackBishop,
  B: whiteBishop,
  q: blackQueen,
  Q: whiteQueen,
  k: blackKing,
  K: whiteKing,
  p: blackPawn,
  P: whitePawn,
};

export { MappingFunction, normalMapping };

// {pieceArray.map((row, i) => {
//   return row.map((cell, j) => {
//     if (cell !== null) {
//       return (
//         <Image
//           x={(j * width) / 8}
//           y={(i * width) / 8}
//           image={mappings[cell.piece]}
//           draggable={true}
//           height={width / 8}
//           width={width / 8}
//           onDragStart={dragStart}
//           onDragEnd={(e) => dragEnd(e, cell, i, j)}
//           _useStrictMode
//         />
//       );
//     }
//   });
// })}
