import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer } from "ws";
import { Maneger } from "./Maneger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_PATH = path.resolve(__dirname, "../../frontend/dist");

const PORT = process.env.PORT || 8080;

const mimeTypes: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url || "/";
  if (reqUrl.includes("?")) {
    reqUrl = reqUrl.split("?")[0] || "/";
  }

  // Health check endpoint for Render health checks and uptime monitoring
  if (reqUrl === "/health" || reqUrl === "/api/health" || reqUrl === "/healthz") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() }));
    return;
  }

  let filePath = path.join(DIST_PATH, reqUrl === "/" ? "index.html" : reqUrl);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA fallback for routes like /game
      filePath = path.join(DIST_PATH, "index.html");
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || "application/octet-stream";

    fs.readFile(filePath, (error, content) => {
      if (error) {
        res.writeHead(500);
        res.end("Server Error loading static file");
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
      }
    });
  });
});

const wss = new WebSocketServer({ server });
const maneger = new Maneger();

wss.on("connection", (socket) => {
  maneger.adduser(socket);
  socket.on("close", () => maneger.removeuser(socket));
});

server.listen(PORT, () => {
  console.log(`Server live on port ${PORT} (Serving Frontend + WebSockets + Health Check)`);
});
