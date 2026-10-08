# Real-Time Chess Arena

A full-stack, real-time multiplayer chess web application built with React 19, TypeScript, TailwindCSS, chess.js, and a Node.js WebSocket backend.

---

## Features

- Real-Time Online Multiplayer: Matchmaking queue with live WebSocket move synchronization between two connected players.
- Play vs Bot AI: Single-player mode integrated with Stockfish engine and automatic legal move fallback.
- Vector Piece Graphics: Uses standard cburnett SVG piece graphics for crisp rendering on retina and 4K displays.
- Dynamic Board Orientation: Auto-flips the board view based on player color assignment (White view / Black view).
- Player Movement Controls: Strict piece validation ensuring players can only move their assigned color's pieces on their turn.
- No-Scroll Viewport Layout: Adaptive square grid container designed to fit 100% of screen height without page scrolling.
- Searching Overlay: Matchmaking status overlay while waiting for an online opponent to join.

---

## Technology Stack

### Frontend
- Framework: React 19, TypeScript, Vite
- Styling: TailwindCSS
- Icons: Lucide React, cburnett SVG Piece Assets
- Engine Logic: chess.js
- Navigation: React Router DOM v7

### Backend
- Runtime: Node.js, TypeScript
- WebSockets: ws
- Bot AI: Stockfish API with local fallback legal move generator
- Server: HTTP Static Server and WebSocket Server on a unified port

---

## Repository Structure

```text
chess/
├── frontend/
│   ├── src/
│   │   ├── component/
│   │   ├── hooks/
│   │   ├── messages/
│   │   └── pages/
│   └── package.json
├── wsbackend/
│   ├── src/
│   │   ├── Game.ts
│   │   ├── Maneger.ts
│   │   ├── Stockfish.ts
│   │   └── index.ts
│   └── package.json
├── package.json
└── README.md
```

---

## Quick Start (Local Development)

### 1. Install Dependencies
```bash
cd frontend && npm install
cd ../wsbackend && npm install
```

### 2. Start Unified Development Server
```bash
npm run dev
```

---

## Deployment Guide

### Deploying Directly on Render (Monorepo Web Service)

1. Create a new Web Service on Render and connect your GitHub repository.
2. Configure settings:
   - Environment: Node
   - Build Command: npm run build
   - Start Command: npm start
3. Click Create Web Service.

Render will automatically build your React frontend, compile your TypeScript backend, and serve both the web application and WebSocket server from your Render URL.

---

## License
MIT License
