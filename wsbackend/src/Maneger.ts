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
        this.games = this.games.filter(g => g.player1 !== socket && g.player2 !== socket);
        if (this.pending === socket) {
            this.pending = null;
        }
    }

    private addhandler(socket: WebSocket) {
        socket.on("message", (messages) => {
            try {
                const message = JSON.parse(messages.toString());

                if (message.type === INIT_GAME) {
                    // Clear previous games for this user
                    this.games = this.games.filter(g => g.player1 !== socket && g.player2 !== socket);

                    if (this.pending) {
                        if (this.pending === socket) {
                            return;
                        }
                        const game = new Game(this.pending, socket, false);
                        this.games.push(game);
                        this.pending = null;
                    } else {
                        this.pending = socket;
                        socket.send(JSON.stringify({
                            type: "searching",
                            payload: "Searching for opponent..."
                        }));
                    }
                }

                if (message.type === INIT_GAME_VS_BOT) {
                    // Clear previous games for this user
                    this.games = this.games.filter(g => g.player1 !== socket && g.player2 !== socket);
                    if (this.pending === socket) {
                        this.pending = null;
                    }

                    // Start a new game against Bot AI
                    const game = new Game(socket, socket, true);
                    this.games.push(game);
                }

                if (message.type === MOVE) {
                    // Find active game for this socket
                    const game = this.games.slice().reverse().find(g => g.player1 === socket || g.player2 === socket);
                    if (game) {
                        const movePayload = message.payload || message.move;
                        if (movePayload) {
                            game.makeMove(socket, movePayload);
                        }
                    }
                }
            } catch (err) {
                console.error("Error processing backend WS message:", err);
            }
        });
    }
}