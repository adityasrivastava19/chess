#!/bin/sh

# Start Nginx in background
nginx

# Start Node.js WebSocket backend in foreground
cd /app/wsbackend && exec node dist/index.js
