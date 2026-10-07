import type WebSocket from "ws";
import { INIT_GAME, INIT_GAME_VS_BOT, MOVE } from "./messages.js";
import { Game } from "./Game.js";

export class Maneger {
    private games: Game[];
    private pending: WebSocket | null;
    private users: WebSocket[];

    constructor() {
        this.games = [];
        this.pending = null;
        this.users = [];
    }

    adduser(socket: WebSocket) {
        this.users.push(socket);
        this.addhandler(socket);
    }

    removeuser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);
        if (this.pending === socket) {
            this.pending = null;
        }
    }

    private addhandler(socket: WebSocket) {
        socket.on("message", (messages) => {
            const message = JSON.parse(messages.toString());

            if (message.type === INIT_GAME) {
                if (this.pending) {
                    // start the game
                    const game = new Game(this.pending, socket);
                    this.games.push(game);
                    this.pending = null;
                } else {
                    this.pending = socket;
                    socket.send("searching opponent");
                }
            }

            if (message.type === INIT_GAME_VS_BOT) {
                // Start a game against Stockfish AI
                const game = new Game(socket, socket, true);
                this.games.push(game);
            }

            if (message.type === MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.move);
                }
            }
        });
    }
}