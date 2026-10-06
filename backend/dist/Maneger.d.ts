import type WebSocket from "ws";
export declare class Maneger {
    private games;
    private pending;
    private users;
    constructor();
    adduser(socket: WebSocket): void;
    removeuser(socket: WebSocket): void;
    private addhandler;
}
//# sourceMappingURL=Maneger.d.ts.map