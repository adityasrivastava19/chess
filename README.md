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
├── frontend/             # React 19 Vite Frontend Application
│   ├── src/
│   │   ├── component/   # ChessBoard, PieceIcons, Buttons
│   │   ├── hooks/       # UseSocket hook
│   │   ├── messages/    # Shared message constants
│   │   └── pages/       # Landing & Game pages
│   └── package.json
├── wsbackend/            # Node.js WebSocket Backend Server
│   ├── src/
│   │   ├── Game.ts      # Match game state & move handler
│   │   ├── Maneger.ts   # User queue & room manager
│   │   ├── Stockfish.ts # Bot AI move generator
│   │   └── index.ts     # Unified HTTP + WS server entry point
│   └── package.json
├── package.json          # Monorepo root scripts
└── README.md
```

---

## Quick Start (Local Development)

### 1. Install Dependencies
```bash
# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../wsbackend && npm install
```

### 2. Start Backend Server
```bash
cd wsbackend
npm run dev
```
Runs on http://localhost:8080 and ws://localhost:8080.

### 3. Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Runs on http://localhost:5173.

---

## Deployment Guide

### Option 1: Cloudflare Pages + Railway / Render

#### 1. Deploy Frontend to Cloudflare Pages
- Connect repository on Cloudflare Dashboard
- Root directory: frontend
- Build command: npm run build
- Output directory: dist
- Environment Variable: VITE_WS_URL = wss://your-backend.up.railway.app

#### 2. Deploy Backend to Railway / Render
- Root directory: wsbackend
- Build command: npm run build
- Start command: node dist/index.js

---

### Option 2: Unified Single-Port Deployment

The backend server in wsbackend/src/index.ts is configured to serve both the static frontend files from frontend/dist and WebSocket connections on a single port (process.env.PORT || 8080).

```bash
# Build both frontend and backend from root
npm run build

# Start unified production server
npm run start
```

---

## License
MIT License
