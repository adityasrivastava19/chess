import React, { useState } from "react";
import { Chess, type Color, type PieceSymbol, type Square } from "chess.js";
import { PieceIcon } from "./PieceIcons";
import { MOVE } from "../messages/message";

export interface ChessBoardProps {
  chess: Chess;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket | null;
  setBoard: (
    board: ({
      square: Square;
      type: PieceSymbol;
      color: Color;
    } | null)[][]
  ) => void;
  playerColor?: "white" | "black";
  disabled?: boolean;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  chess,
  board,
  socket,
  setBoard,
  playerColor = "white",
  disabled = false,
}) => {
  const [from, setFrom] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);

  const isBlackView = playerColor === "black";
  const expectedPieceColor: Color = isBlackView ? "b" : "w";
  const isMyTurn = chess.turn() === expectedPieceColor;

  const handleSquareClick = (squareRepresentation: Square) => {
    if (disabled || !isMyTurn) return;

    // 1. If no square selected yet -> Select piece
    if (!from) {
      const piece = chess.get(squareRepresentation);
      if (!piece) return;

      // Restrict movement: Only allow selecting piece of assigned player color
      if (piece.color !== expectedPieceColor) return;

      const moves = chess.moves({ square: squareRepresentation, verbose: true });
      if (moves.length === 0) return;

      setFrom(squareRepresentation);
      setPossibleMoves(moves.map((m) => m.to as Square));
      return;
    }

    // 2. If clicking the already selected square -> Deselect
    if (from === squareRepresentation) {
      setFrom(null);
      setPossibleMoves([]);
      return;
    }

    // 3. If clicking a valid target square -> Perform move
    if (possibleMoves.includes(squareRepresentation)) {
      try {
        const moveResult = chess.move({
          from,
          to: squareRepresentation,
          promotion: "q",
        });

        if (moveResult) {
          setBoard(chess.board());
          socket?.send(
            JSON.stringify({
              type: MOVE,
              payload: {
                from,
                to: squareRepresentation,
                promotion: "q",
              },
            })
          );
        }
      } catch (e) {
        console.error("Invalid move error:", e);
      }
      setFrom(null);
      setPossibleMoves([]);
      return;
    }

    // 4. If clicking another piece of the user's assigned color -> Switch selection
    const piece = chess.get(squareRepresentation);
    if (piece && piece.color === expectedPieceColor) {
      const moves = chess.moves({ square: squareRepresentation, verbose: true });
      if (moves.length > 0) {
        setFrom(squareRepresentation);
        setPossibleMoves(moves.map((m) => m.to as Square));
      } else {
        setFrom(null);
        setPossibleMoves([]);
      }
    } else {
      setFrom(null);
      setPossibleMoves([]);
    }
  };

  const gridRows = [0, 1, 2, 3, 4, 5, 6, 7];
  const gridCols = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="flex flex-col items-center justify-center select-none w-full h-full p-1">
      <div className="relative border-4 border-[#1E293B] rounded-2xl overflow-hidden shadow-2xl bg-[#1E293B] aspect-square max-h-[calc(100vh-100px)] max-w-[calc(100vh-100px)] w-full">
        <div className="grid grid-rows-8 grid-cols-8 w-full h-full aspect-square">
          {gridRows.map((r) => {
            const boardRowIndex = isBlackView ? 7 - r : r;
            const rankNumber = 8 - boardRowIndex;

            return gridCols.map((c) => {
              const boardColIndex = isBlackView ? 7 - c : c;
              const fileLetter = String.fromCharCode(97 + boardColIndex);
              const squareRepresentation = `${fileLetter}${rankNumber}` as Square;

              const square = board[boardRowIndex]?.[boardColIndex] ?? null;

              const isDarkSquare = (boardRowIndex + boardColIndex) % 2 === 1;
              const isSelected = from === squareRepresentation;
              const isPossibleMove = possibleMoves.includes(squareRepresentation);

              let bgStyle = isDarkSquare ? "bg-[#739552]" : "bg-[#EBECD0]";
              if (isSelected) {
                bgStyle = "bg-[#BBCB2B] shadow-inner";
              }

              return (
                <div
                  key={squareRepresentation}
                  onClick={() => handleSquareClick(squareRepresentation)}
                  className={`relative flex items-center justify-center transition-colors duration-150 ${
                    isMyTurn && !disabled ? "cursor-pointer" : "cursor-not-allowed"
                  } ${bgStyle}`}
                >
                  {/* Rank Coordinates */}
                  {c === 0 && (
                    <span
                      className={`absolute top-0.5 left-1 text-[9px] sm:text-xs font-bold pointer-events-none ${
                        isDarkSquare ? "text-[#EBECD0]" : "text-[#739552]"
                      }`}
                    >
                      {rankNumber}
                    </span>
                  )}
                  {/* File Coordinates */}
                  {r === 7 && (
                    <span
                      className={`absolute bottom-0.5 right-1 text-[9px] sm:text-xs font-bold pointer-events-none ${
                        isDarkSquare ? "text-[#EBECD0]" : "text-[#739552]"
                      }`}
                    >
                      {fileLetter}
                    </span>
                  )}

                  {/* Possible Move Indicator */}
                  {isPossibleMove && (
                    <div
                      className={`absolute z-10 rounded-full pointer-events-none ${
                        square
                          ? "w-full h-full border-4 border-black/20"
                          : "w-3.5 h-3.5 sm:w-5 sm:h-5 bg-black/20"
                      }`}
                    />
                  )}

                  {/* Piece Representation */}
                  {square && (
                    <div className="w-[82%] h-[82%] z-20 flex items-center justify-center transform hover:scale-105 transition-transform duration-100 drop-shadow-md">
                      <PieceIcon type={square.type} color={square.color} />
                    </div>
                  )}
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
};
