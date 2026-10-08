import React from "react";
import type { Color, PieceSymbol } from "chess.js";

interface PieceProps {
  type: PieceSymbol;
  color: Color;
  className?: string;
}

// Lichess cburnett standard vector SVG piece CDN URLs
const PIECE_URLS: Record<string, string> = {
  wP: "https://lichess1.org/assets/piece/cburnett/wP.svg",
  wN: "https://lichess1.org/assets/piece/cburnett/wN.svg",
  wB: "https://lichess1.org/assets/piece/cburnett/wB.svg",
  wR: "https://lichess1.org/assets/piece/cburnett/wR.svg",
  wQ: "https://lichess1.org/assets/piece/cburnett/wQ.svg",
  wK: "https://lichess1.org/assets/piece/cburnett/wK.svg",
  bP: "https://lichess1.org/assets/piece/cburnett/bP.svg",
  bN: "https://lichess1.org/assets/piece/cburnett/bN.svg",
  bB: "https://lichess1.org/assets/piece/cburnett/bB.svg",
  bR: "https://lichess1.org/assets/piece/cburnett/bR.svg",
  bQ: "https://lichess1.org/assets/piece/cburnett/bQ.svg",
  bK: "https://lichess1.org/assets/piece/cburnett/bK.svg",
};

// Wikimedia Commons fallback URLs
const FALLBACK_URLS: Record<string, string> = {
  wP: "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg",
  wN: "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg",
  wB: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg",
  wR: "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg",
  wQ: "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg",
  wK: "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg",
  bP: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg",
  bN: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg",
  bB: "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg",
  bR: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg",
  bQ: "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg",
  bK: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg",
};

export const PieceIcon: React.FC<PieceProps> = ({ type, color, className = "w-full h-full" }) => {
  const pieceKey = `${color}${type.toUpperCase()}`;
  const primaryUrl = PIECE_URLS[pieceKey];
  const fallbackUrl = FALLBACK_URLS[pieceKey];

  return (
    <img
      src={primaryUrl}
      alt={`${color === "w" ? "White" : "Black"} ${type}`}
      onError={(e) => {
        const target = e.currentTarget;
        if (target.src !== fallbackUrl && fallbackUrl) {
          target.src = fallbackUrl;
        }
      }}
      className={`${className} pointer-events-none select-none drop-shadow-md transition-transform duration-100 transform hover:scale-105`}
      draggable={false}
    />
  );
};
