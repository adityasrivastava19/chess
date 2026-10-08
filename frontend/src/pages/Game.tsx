import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Button } from "../component/button";
import { ChessBoard } from "../component/ChessBoard";
import { UseSocket } from "../hooks/usesocket";
import { INIT_GAME, INIT_GAME_VS_BOT, MOVE, GAME_OVER } from "../messages/message";
import { Users } from "lucide-react";

export const Game = () => {
  const socket = UseSocket();
  const chessRef = useRef(new Chess());
  const [board, setboard] = useState(chessRef.current.board());
  const [started, setStarted] = useState(false);
  const [searching, setSearching] = useState(false);
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
  const [gameResult, setGameResult] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("WebSocket Message Received:", message);

        switch (message.type) {
          case "searching": {
            setSearching(true);
            setStarted(false);
            break;
          }

          case INIT_GAME: {
            chessRef.current = new Chess();
            setboard(chessRef.current.board());
            setStarted(true);
            setSearching(false);
            setGameResult(null);
            if (message.payload?.color) {
              setPlayerColor(message.payload.color);
            }
            break;
          }

          case MOVE: {
            const move = message.payload;
            try {
              chessRef.current.move(move);
              setboard(chessRef.current.board());
            } catch (e) {
              console.error("Error applying move from socket:", e);
            }
            break;
          }

          case GAME_OVER: {
            const winner = message.payload?.winner;
            setGameResult(winner ? `Game Over! Winner: ${winner}` : "Game Over!");
            setStarted(false);
            setSearching(false);
            break;
          }
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [socket]);

  const handleStartGame = (vsBot = false) => {
    if (!socket) return;
    setGameResult(null);
    setSearching(!vsBot);
    socket.send(
      JSON.stringify({
        type: vsBot ? INIT_GAME_VS_BOT : INIT_GAME,
      })
    );
  };

  const isMyTurn = started && chessRef.current.turn() === (playerColor === "white" ? "w" : "b");

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0E131F] text-white flex flex-col md:flex-row items-center justify-center p-3 md:p-6 gap-4 md:gap-8">
      {/* Left side: Chess Board Container */}
      <div className="relative flex flex-col items-center justify-center h-full max-h-full aspect-square flex-1">
        {gameResult && (
          <div className="absolute top-2 z-30 py-2 px-6 bg-amber-500/90 border border-amber-400 text-slate-950 rounded-full font-bold shadow-lg animate-bounce text-sm">
            {gameResult}
          </div>
        )}

        {/* Searching Overlay on top of Board */}
        {searching && (
          <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 gap-4 border border-amber-500/30">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
              <Users className="w-6 h-6 text-amber-300 absolute" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-amber-300 mb-1">
                Finding Opponent...
              </h3>
              <p className="text-xs text-slate-400">
                Waiting for another player to join online match
              </p>
            </div>
            <div className="flex gap-1.5 mt-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping delay-150" />
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping delay-300" />
            </div>
          </div>
        )}

        <ChessBoard
          chess={chessRef.current}
          board={board}
          socket={socket}
          setBoard={setboard}
          playerColor={playerColor}
          disabled={!started || Boolean(gameResult)}
        />
      </div>

      {/* Right side: Dashboard Panel */}
      <div className="w-full md:w-[320px] shrink-0 bg-[#182032] border border-[#2A364F] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-wide text-[#F7D878] mb-0.5">
            Chess Arena
          </h2>
          <p className="text-xs text-gray-400">
            {socket ? "Connected to Server" : "Connecting to server..."}
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-[#0E131F] p-3.5 rounded-xl border border-[#2A364F] flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Status:</span>
            <span
              className={`font-semibold ${
                started
                  ? "text-emerald-400"
                  : searching
                  ? "text-amber-400 animate-pulse"
                  : "text-gray-400"
              }`}
            >
              {started
                ? "Match in Progress"
                : searching
                ? "Searching Opponent..."
                : "Waiting to Join"}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Your Color:</span>
            <span className="font-semibold capitalize text-amber-300">
              {started ? playerColor : "-"}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Turn:</span>
            <span
              className={`font-semibold capitalize ${
                !started
                  ? "text-gray-500"
                  : isMyTurn
                  ? "text-emerald-400 font-bold"
                  : "text-blue-400"
              }`}
            >
              {!started
                ? "-"
                : isMyTurn
                ? "Your Turn"
                : `Opponent's Turn (${chessRef.current.turn() === "w" ? "White" : "Black"})`}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <Button
            variant="primary"
            size="md"
            text={
              searching
                ? "Searching..."
                : started
                ? "Find New Match"
                : "Play Online"
            }
            onClick={() => handleStartGame(false)}
          />
          <Button
            variant="secondary"
            size="md"
            text="Play vs Bot"
            onClick={() => handleStartGame(true)}
          />
        </div>
      </div>
    </div>
  );
};