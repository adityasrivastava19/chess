import type WebSocket from "ws";
import {  Chess } from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE } from "./messages.js";
export class Game{
    public player1:WebSocket;
    public player2 :WebSocket;
    public board:Chess;
    private strattime:Date;
    private countmoves=0;
    constructor(player1:WebSocket,player2:WebSocket)
    {
        this.player1=player1;
        this.player2=player2;
        this.board=new Chess();
        this.strattime=new Date();
        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload:{color:"white"}
        }));
        this.player2.send(JSON.stringify({
            type:INIT_GAME,
            payload:{color:"black"}
        }));
    }
    makeMove(sockect:WebSocket,move:{ from :string,to:string })
    {
        if(this.countmoves%2===0 && sockect!==this.player1)
        {
            return 
        }
        if(this.countmoves%2===1 && sockect!==this.player2)
        {
            return 
        }
        // validating and making the move 
        try {
            this.board.move(move);
        } catch (e) {
            return ;
        }
        //checking the game over or not 
        if(this.board.isGameOver())
        {
            this.player1.emit(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner:this.board.turn()==="w"?"black":"white"
                }
            }))
            return 
        }
        // tell the eigther side that move have been made
        if(this.countmoves%2===0)
        {
            this.player2.send(JSON.stringify({
                type:MOVE,
                payload:move
            }))
        }
        else{
              this.player1.send(JSON.stringify({
                type:MOVE,
                payload:move
            }))
        }
        this.countmoves++;
    }
}