import type WebSocket from "ws";
import { Chess } from 'chess.js';
import { GAME_OVER, INIT_GAME, MOVE } from "./messages.js";
import { Stockfish } from "./Stockfish.js";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    private strattime: Date;
    private countmoves = 0;
    public isBotGame: boolean;

    constructor(player1: WebSocket, player2: WebSocket, isBotGame = false) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.strattime = new Date();
        this.isBotGame = isBotGame;

        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: { color: "white" }
        }));

        if (!this.isBotGame && this.player1 !== this.player2) {
            this.player2.send(JSON.stringify({
                type: INIT_GAME,
                payload: { color: "black" }
            }));
        }
    }

    async makeMove(sockect: WebSocket, move: { from: string; to: string; promotion?: string }) {
        if (this.countmoves % 2 === 0 && sockect !== this.player1) {
            return;
        }
        if (!this.isBotGame && this.countmoves % 2 === 1 && sockect !== this.player2) {
            return;
        }

        // validating and making the move 
        try {
            this.board.move(move);
        } catch (e) {
            return;
        }

        // checking if game is over
        if (this.board.isGameOver()) {
            const gameOverPayload = JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            });
            this.player1.send(gameOverPayload);
            if (!this.isBotGame && this.player1 !== this.player2) {
                this.player2.send(gameOverPayload);
            }
            return;
        }

        // tell the other side that move has been made
        if (!this.isBotGame) {
            if (this.countmoves % 2 === 0) {
                this.player2.send(JSON.stringify({
                    type: MOVE,
                    payload: move
                }));
            } else {
                this.player1.send(JSON.stringify({
                    type: MOVE,
                    payload: move
                }));
            }
        }
        this.countmoves++;

        // If playing against computer, trigger Stockfish move
        if (this.isBotGame && !this.board.isGameOver()) {
            await this.makeStockfishMove();
        }
    }

    public async makeStockfishMove() {
        const botMove = await Stockfish.getBestMove(this.board.fen());
        if (!botMove) return;

        try {
            this.board.move(botMove);
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: botMove
            }));
            this.countmoves++;

            if (this.board.isGameOver()) {
                this.player1.send(JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner: this.board.turn() === "w" ? "black" : "white"
                    }
                }));
            }
        } catch (e) {
            console.error("Error applying Stockfish move:", e);
        }
    }
}