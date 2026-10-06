import { BLACK, Chess } from 'chess.js';
import { GAME_OVER, INIT_GAME, MOVE } from "./messages.js";
export class Game {
    player1;
    player2;
    board;
    strattime;
    countmoves = 0;
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.strattime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: { color: "white" }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: { color: "black" }
        }));
    }
    makeMove(sockect, move) {
        if (this.countmoves % 2 === 0 && sockect !== this.player1) {
            return;
        }
        if (this.countmoves % 2 === 1 && sockect !== this.player2) {
            return;
        }
        // validating and making the move 
        try {
            this.board.move(move);
        }
        catch (e) {
            return;
        }
        //checking the game over or not 
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            return;
        }
        // tell the eigther side that move have been made
        if (this.countmoves % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));
        }
        this.countmoves++;
    }
}
//# sourceMappingURL=Game.js.map