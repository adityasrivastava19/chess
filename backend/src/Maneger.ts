import type WebSocket from "ws";
import { INIT_GAME, MOVE } from "./messages.js";
import { Game } from "./Game.js";
export class Maneger {
    private games:Game[];
    private pending:WebSocket|null;
    private users:WebSocket[];
    constructor(){
        this.games=[];
        this.pending=null;
        this.users=[];
    }
    adduser(socket:WebSocket)
    {
        this.users.push(socket);
        this.addhandler(socket);
    }
    removeuser(socket:WebSocket)
    {
        this.users=this.users.filter(user=>user!==socket);
    }

    private addhandler(socket:WebSocket)
    {
        socket.on("message",(messages)=>{
            const message=JSON.parse(messages.toString());
            if(message.type===INIT_GAME)
            {
                if(this.pending)
                {
                    //start the game
                    const game=new Game(this.pending,socket);
                    this.games.push(game);
                    this.pending=null;
                }
                else{
                    this.pending=socket;
                    socket.send("searching opponent");
                }
            }
            if(message.type===MOVE)
            {
                const game=this.games.find(game=>game.player1===socket || game.player2===socket);
                if(game)
                {
                    game.makeMove(socket,message.move)
                }
            }
        })
    }

}