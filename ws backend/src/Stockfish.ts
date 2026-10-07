import { Chess } from "chess.js";

export interface StockfishMove {
    from: string;
    to: string;
    promotion?: string;
}

export class Stockfish {
    //Get the best move from Stockfish API or fallback heuristic
    public static async getBestMove(fen: string, depth = 10): Promise<StockfishMove | null> {
        try {
            const url = `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(fen)}&depth=${depth}`;
            const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
            if (!response.ok) {
                throw new Error(`Stockfish API HTTP error: ${response.status}`);
            }

            const data = (await response.json()) as { success?: boolean; bestmove?: string };
            if (data.success && data.bestmove) {
                const parts = data.bestmove.split(" ");
                const moveStr = parts[1] ?? parts[0];
                if (moveStr && moveStr.length >= 4) {
                    const from = moveStr.substring(0, 2);
                    const to = moveStr.substring(2, 4);
                    const moveObj: StockfishMove = { from, to };
                    if (moveStr.length > 4 && moveStr[4]) {
                        moveObj.promotion = moveStr[4];
                    }
                    return moveObj;
                }
            }
        } catch (error) {
            console.warn("Stockfish API request failed, falling back to local engine move:", error);
        }

        return this.getFallbackMove(fen);
    }

    
      //Fallback move generator using legal chess moves if API fails or times out
   
    private static getFallbackMove(fen: string): StockfishMove | null {
        try {
            const chess = new Chess(fen);
            const moves = chess.moves({ verbose: true });
            if (moves.length === 0) return null;

            const captureOrCheck = moves.find((m) => m.captured || m.san.includes("+"));
            const chosenMove = captureOrCheck ?? moves[Math.floor(Math.random() * moves.length)];

            if (!chosenMove) return null;

            const moveObj: StockfishMove = {
                from: chosenMove.from,
                to: chosenMove.to,
            };
            if (chosenMove.promotion) {
                moveObj.promotion = chosenMove.promotion;
            }

            return moveObj;
        } catch {
            return null;
        }
    }
}
