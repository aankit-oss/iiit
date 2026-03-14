import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// ── Types ────────────────────────────────────────────────────────────────────

interface PlayerState {
  id: string;
  name: string;
  x: number;
  y: number;
  status: 'safe' | 'danger' | 'unknown' | 'caught';
  socketId: string;
}

interface Room {
  code: string;
  players: Map<string, PlayerState>;
  demogorgonSocketId: string | null;
  /** Unix ms when game started — used for 5-minute timeout */
  startedAt: number;
  gameOver: boolean;
}

// ── State ────────────────────────────────────────────────────────────────────

const rooms = new Map<string, Room>();

function getOrCreateRoom(code: string): Room {
  if (!rooms.has(code)) {
    rooms.set(code, {
      code,
      players: new Map(),
      demogorgonSocketId: null,
      startedAt: Date.now(),
      gameOver: false,
    });
  }
  return rooms.get(code)!;
}

function checkGameOver(room: Room): { over: boolean; winner: 'demogorgon' | 'security' } {
  const alive = [...room.players.values()].filter(
    p => p.socketId !== room.demogorgonSocketId && p.status !== 'caught'
  );
  if (alive.length === 0) return { over: true, winner: 'demogorgon' };
  if (Date.now() - room.startedAt >= 5 * 60 * 1000) return { over: true, winner: 'security' };
  return { over: false, winner: 'security' };
}

// ── App ──────────────────────────────────────────────────────────────────────

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// ── Socket Handlers ───────────────────────────────────────────────────────────

io.on('connection', (socket) => {
  console.log(`[+] Connected: ${socket.id}`);

  let currentRoom: Room | null = null;
  let currentPlayerId: string | null = null;

  // ── Join Room ──────────────────────────────────────────────────────────────
  socket.on('joinRoom', (data: {
    roomCode: string;
    playerId: string;
    playerName: string;
    role: 'security' | 'demogorgon';
    x: number;
    y: number;
  }) => {
    const room = getOrCreateRoom(data.roomCode);
    currentRoom = room;
    currentPlayerId = data.playerId;

    socket.join(data.roomCode);

    const playerState: PlayerState = {
      id: data.playerId,
      name: data.playerName,
      x: data.x,
      y: data.y,
      status: 'safe',
      socketId: socket.id,
    };

    room.players.set(data.playerId, playerState);

    if (data.role === 'demogorgon') {
      room.demogorgonSocketId = socket.id;
    }

    // Send current room state to the joining player
    socket.emit('roomState', {
      players: [...room.players.values()],
      demogorgonSocketId: room.demogorgonSocketId,
    });

    // Broadcast new player to rest of room
    socket.to(data.roomCode).emit('playerJoined', playerState);
    console.log(`[room:${data.roomCode}] ${data.playerName} joined as ${data.role}`);
  });

  // ── Position Update ────────────────────────────────────────────────────────
  socket.on('positionUpdate', (data: { playerId: string; x: number; y: number }) => {
    if (!currentRoom) return;
    const player = currentRoom.players.get(data.playerId);
    if (player) {
      player.x = data.x;
      player.y = data.y;
      socket.to(currentRoom.code).emit('playerMoved', {
        playerId: data.playerId,
        x: data.x,
        y: data.y,
      });
    }
  });

  // ── Catch Attempt ──────────────────────────────────────────────────────────
  socket.on('catchAttempt', (data: { targetPlayerId: string }) => {
    if (!currentRoom || currentRoom.gameOver) return;

    const target = currentRoom.players.get(data.targetPlayerId);
    if (!target) return;

    target.status = 'caught';
    io.to(currentRoom.code).emit('playerCaught', { playerId: data.targetPlayerId });
    console.log(`[room:${currentRoom.code}] ${data.targetPlayerId} was caught!`);

    const { over, winner } = checkGameOver(currentRoom);
    if (over) {
      currentRoom.gameOver = true;
      const fates = [...currentRoom.players.values()]
        .filter(p => p.socketId !== currentRoom!.demogorgonSocketId)
        .map(p => ({ name: p.name, status: p.status }));

      io.to(currentRoom.code).emit('gameOver', { winner, fates });
      console.log(`[room:${currentRoom.code}] Game over! Winner: ${winner}`);
    }
  });

  // ── Accuse Attempt ─────────────────────────────────────────────────────────
  socket.on('accuseAttempt', (data: { accusedPlayerId: string; accuserId: string }) => {
    if (!currentRoom || currentRoom.gameOver) return;
    // Broadcast the accusation so all players see it
    io.to(currentRoom.code).emit('playerAccused', {
      accusedPlayerId: data.accusedPlayerId,
      accuserId: data.accuserId,
    });

    // Check if the accused IS the demogorgon
    const accused = currentRoom.players.get(data.accusedPlayerId);
    const isDemogorgon = accused?.socketId === currentRoom.demogorgonSocketId;

    if (isDemogorgon) {
      currentRoom.gameOver = true;
      const fates = [...currentRoom.players.values()]
        .filter(p => p.socketId !== currentRoom!.demogorgonSocketId)
        .map(p => ({ name: p.name, status: p.status }));

      io.to(currentRoom.code).emit('gameOver', { winner: 'security', fates });
      console.log(`[room:${currentRoom.code}] Demogorgon correctly accused! Security wins.`);
    }
  });

  // ── Timer Check (5-min game timer) ────────────────────────────────────────
  const timerInterval = setInterval(() => {
    if (!currentRoom || currentRoom.gameOver) return;
    const { over, winner } = checkGameOver(currentRoom);
    if (over) {
      currentRoom.gameOver = true;
      const fates = [...currentRoom.players.values()]
        .filter(p => p.socketId !== currentRoom!.demogorgonSocketId)
        .map(p => ({ name: p.name, status: p.status }));
      io.to(currentRoom.code).emit('gameOver', { winner, fates });
      clearInterval(timerInterval);
    }
  }, 10_000); // check every 10s

  // ── Disconnect ─────────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    clearInterval(timerInterval);
    if (currentRoom && currentPlayerId) {
      currentRoom.players.delete(currentPlayerId);
      socket.to(currentRoom.code).emit('playerLeft', { playerId: currentPlayerId });
      console.log(`[-] Disconnected: ${socket.id}`);
    }
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT ?? 3001;
httpServer.listen(PORT, () => {
  console.log(`🔴 Hawkins Lab server running on http://localhost:${PORT}`);
});
