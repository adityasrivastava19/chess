import {WebSocketServer, type RawData} from "ws";
import { Maneger } from "./Maneger.js";
const wss=new WebSocketServer({port: 8080});
console.log("server is live");
const maneger=new Maneger();
wss.on("connection",(socket)=>{
    maneger.adduser(socket);
    socket.on("close",()=>maneger.removeuser(socket));
})


